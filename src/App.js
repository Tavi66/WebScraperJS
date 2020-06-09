import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

//import bookService from './services/books'
    

//Display Info
//Code to save to db.json //Eventually save to MongoDB

function App() {
const baseUrl = "http://localhost:3001/";
const url = "http://localhost:3001/books";
const headers = {
  "Content-Type": "application/json"
}

//Access express backend

  const [books, setBooks] = useState([]);

  useEffect(()=>{
    console.log('effects for books');
  const bookList = axios.get(baseUrl, headers)
  .then(response => {
    console.log(response);
      console.log('promise fulfilled');  
      return response.data;  
    });  

  bookList.then(element => {
    setBooks(books.push(element));
    console.log('book: ', books);
  console.log('books: ', books);
  //tranverse the book list then add to JSON DB
  books.forEach(element => {
    //console.log(axios.post(url,element));
    element.forEach(response => {
          axios.post(url,response);
          //console.log('element: ', response);
    })
    });

  }).catch(error=>console.log('error: ',error));

  //  axios.post(url,response)
  //   .catch(error => console.log(error));
//  bookList.then(book => {
//    axios.post(url,book)
//     .then(response => {
//       console.log('promise fulfilled');
//     })
//     .catch(error => console.log(error));
//   });
  },[]);
    
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
