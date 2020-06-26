import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import useDebounced from './debounced';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


export default function Grid() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('ALL');
  const [isSearchInprogress, setSearchInprogress] = useState(false);

  const debouncedSearchTerm = useDebounced(searchTerm, 500);

  useEffect(
    () => {
      //if (debouncedSearchTerm) {
        setSearchInprogress(true);
        searchUser(debouncedSearchTerm).then(results => {
          setSearchInprogress(false);
          console.log(results)
        
          if(searchTerm != "" && searchTerm != "ALL"){
            // Just filtering as using the mock data
            results = results.filter(r => {
                console.log(r);
                return (
                    r.first_name.toUpperCase().indexOf(searchTerm) > -1
                    || r.last_name.toUpperCase().indexOf(searchTerm) > -1
                    || r.email.toUpperCase().indexOf(searchTerm) > -1
                    )
                } 
            )
          }
          
          setItems(results);
        });
      /*} else {
        setItems([]);
      }*/
    },
    
    [debouncedSearchTerm]
  );


  return (
      <>
      <TextField id="standard-search" onChange={e => setSearchTerm(e.target.value.toUpperCase())} label="Search field" type="search" />
      {isSearchInprogress && <div>Searching ...</div>}
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="User List">
        <TableHead>
          <TableRow>
            <TableCell>Firstname</TableCell>
            <TableCell align="right">Lastname</TableCell>
            <TableCell align="right">email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.name}>
              <TableCell align="right">{row.first_name}</TableCell>
              <TableCell align="right">{row.last_name}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

function searchUser(searchText){
    return fetch("/mock-data/data.json")
    .then(r => r.json())
    .then(r => r)
    .catch(error => {
      console.error(error);
      return [];
    });
}