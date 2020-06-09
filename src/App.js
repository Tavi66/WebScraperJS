import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import bookService from './services/books'

//import bookList from './book'
//Display Info
// const Books = () => {

// }
//Get best selling items' info 

function App() {

  const [books, setBooks] = useState([]);

  useEffect(()=>{
    console.log('effects for books');
    bookService
    .getAll()
    .then(response => {
      console.log('promise fulfilled');
      setBooks(response);
    })
    .catch(error => console.log(error));
  },[]);
    
  
  // bookList.forEach(bookObj => {
  //   bookService
  //   .create(bookObj)
  //   .then(response=>{
  //     console.log(response);
  //     setBooks(books.concat(response));
  //   })
  // });
  
  // console.log('booklist: ', bookList);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Books</h2>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
