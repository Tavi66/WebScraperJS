import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

//import bookService from './services/books';
//Display Info
//Code to save 
const AddBooks = ({books}) => {
  const list = books===undefined ? '': books.forEach(element => <li>{element}</li>);
  return(
    <div>
      {list}
    </div>
  )
}

function App() {
const baseUrl = "http://localhost:3001/";
let url = "api";
const headers = {
  "Content-Type": "application/json"
}


//Access express backend

  const [books, setBooks] = useState([]);
  const [products, setProducts] = useState([]);
  const [list, setList] = useState([]);

  useEffect(()=>{
    console.log('useEffect for app');
    //const bookList = bookService.scrape(baseUrl);
    // console.log('Scraping books...');
    // const bookList = axios.get(baseUrl, headers)
    // .then(response => {
    //   //console.log(response.data);
    //     console.log('books scraped!');  
    //     return response.data;  
    //   })
    //   .catch(error=>console.log('error: ',error)); 

    // bookList.then(element => {
    //   console.log(element);
    //   setBooks(element);
    //   console.log('books saved to array!')
    // });

  
  },[]);
  
  const scrapeBooks = () => { 
    console.log('Scraping books...');
    url = baseUrl.concat('books');
    const bookList = axios.get(url, headers)
    .then(response => {
      //console.log(response.data);
        console.log('books scraped!');  
        return response.data;  
      })
      .catch(error=>console.log('error: ',error)); 

    bookList.then(element => {
      console.log(element);
      setBooks(element);
      console.log('books saved to array!')
    });
  }

  const addBooks = () => {
    console.log('books (fun): ', books);
    url = baseUrl.concat('api/books');
    axios.post(url,books)
     .then(response => console.log('Adding book to DB...'))
     .catch(error => console.log(error));
     setList(books);

  }
  
  const handleAddBook = () => {
    //add books if books do not already exist.
    //need to add validation to DB entries.
    books !== list ? addBooks(): console.log('Books added already!');
  }

  const scrapeTopElectronics = () => {
    console.log('Scraping top electronics...');
    url = baseUrl.concat('tech');
    const itemList = axios.get(url, headers)
    .then(response => {
      //console.log(response.data);
        console.log('tech scraped!');  
        return response.data;  
      })
      .catch(error=>console.log('error: ',error)); 

    itemList.then(element => {
      console.log(element);
      setProducts(element);
      console.log('tech saved to array!')
    });

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Books</h2>
        <button onClick={() => scrapeTopElectronics()}>Scrape Electronics </button>
        <button onClick={() => scrapeBooks()}>Scrape Books</button>
        <button onClick={() => handleAddBook()}>Add Books</button> 
        <AddBooks books={books}/>
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
