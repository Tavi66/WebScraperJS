
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser  = require('body-parser');

const app = express();
const port = process.envPORT || 3001;

const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const db = require('mongodb').Db;

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node server.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const mongoUrl = `mongodb+srv://tavi:${password}@cluster0-uo1y8.mongodb.net/books?retryWrites=true&w=majority`;
const Book = require('./models/book');
// const client = new MongoClient(mongoUrl, {useNewUrlParser:true, useUnifiedTopology: true});
// client.connect()
//  .then(result => {
//    console.log('connected to MongoDB')
//   })
//  .catch(error => console.log('error connecting to mongoDB: ', error));
// const client = new MongoClient(mongoUrl, {useNewUrlParser:true, useUnifiedTopology: true});
// client.connect()
// .then(result => console.log('connected to MongoDB'))
// .catch(error => console.log('error connecting to mongoDB: ', error));

//const Book = mongoose.model('Book', bookSchema);

// Book.find({}).then(result => {
//     result.forEach(book => {
//         console.log(book);
//     })
//     mongoose.connection.close();
// })

app.use(cors())
app.use(bodyParser.json())

// const generateId = () => {
//     const maxId = books.length > 0 ? 
//     Math.max(...books.map(n => n.id)) : 0
  
//     return maxId + 1
//   }
  
 
  app.get('/',(request,response) => {
      const url = 'https://www.amazon.com/gp/bestsellers/digital-text/6487835011/ref=pd_zg_hrsr_digital-text';
      // const browser = await puppeteer.launch({
      //     headless: false, //false: displays chrome instance running
      //     defaultViewport: null, //(optional) useful in headless mode
      // });
      puppeteer.launch().then(async function(browser) {
      const page = await browser.newPage();
      await page.goto(url, {waitUntil: 'networkidle2'}).catch(error => void 0);
      await page.waitFor('ol.a-ordered-list.a-vertical');
      const result = await page.evaluate(()=> {
        //total product amount
        let totalSearchResults = Array.from(document.querySelectorAll('li.zg-item-immersion')).length;
        let bookList = [];
  
        for(let i = 0;  i < totalSearchResults - 1; i++) {
           //book info object structure
            let book = {
                rank: "",
                name: "",
                author: "",
                rating: "",
                //published: '',
                //description: '',
                //image: '',
                price: "",
            }
          
          //generate array of best-selling books
          let productNodes = Array.from(document.querySelectorAll(`li.zg-item-immersion`));
  
          //transverse search results for product info
          //Get info text from list items, then split into array of respective info
          let productsDetails = productNodes.map(element => element.innerText ); 
          let infoArr = Array.from(productsDetails[i].split("\n"));
  
          //Save book data to book object
            book.rank = infoArr[0]; //best-selling rank
            book.name = infoArr[1]; //Title of book
            book.author = infoArr[2]; //Author of book
            book.rating = infoArr[3]; //Current Amazon rating of book
            book.price = infoArr[6]; //Current price of book
            bookList = bookList.concat(book);
          }
        return bookList;
      })
      //console.log('Result:', result);
      await browser.close();

      response.send(result);
      })
  });
  app.post('/api/books',(request,response) => {
    const books = request.body;
    
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(error, db) {
    const dbo = db.db("books"); 
      console.log('Adding documents...');
      dbo.collection("books").insertMany(books)
    .then(res => {
      console.log('Added documents!');
      console.log(res);
      mongoose.connection.close().then(console.log('mongoDB connection closed.'));
    })
    .catch(error => {
      console.log('error adding documents: ',error);
      mongoose.connection.close().then(console.log('mongoDB connection closed.'));
    });}
    )

      //mongoose.connection.close().then(console.log('mongoDB connection closed.'));

    //console.log(books);
    
    // console.log('Attempting to insert documents...');
    // Book.insertMany(books)
    // .then(res => {
    //   console.log(res);
    //   mongoose.connection.close().then(console.log('mongoDB connection closed.'));
    // })
    // .catch(error => {
    //   console.log('error adding documents: ',error);
    //   mongoose.connection.close().then(console.log('mongoDB connection closed.'));
    // });

//    let list = [];
    // for(let i = 0; i < books.length; i++)
    // {
    //   const book = new Book(books[i]);
    //   list = list.concat(book);
    // }
//    response.send(request);

//     book.save().then(result =>{
//     console.log('book saved!');
//     mongoose.connection.close();
// }).catch(error=>console.log('error: ', error))
    // const body = request.body;
    // if(!body){
    //   return response.status(400).json({
    //     error: 'content missing'
    //   })
    // } 

    // const book = {
    //   rank: body.rank,
    //   name: body.name,
    //   author: body.author,
    //   rating: body.rating,
    //   price: body.price,
    // }
    
    // books = books.concat(book);
    // response.json(book);
    // console.log(book);
    //console.log(request.headers)
});
  
  app.post('/books',(request,response) => {
      const body = request.body;
      if(!body){
        return response.status(400).json({
          error: 'content missing'
        })
      } 
  
      const book = {
        rank: body.rank,
        name: body.name,
        author: body.author,
        rating: body.rating,
        price: body.price,
        id: generateId(),
      }
      
      books = books.concat(book);
      response.json(book);
      console.log(book);
      //console.log(request.headers)
  });
  
  
  app.get('/api/books',(request,response) => {
    Book.find({}).then(books => {
            response.json(books);
            mongoose.connection.close();
    })
  });

  app.get('/books/:id', (request, response) => {
    const id = Number(request.params.id)
    //console.log(id)
    const book = books.find(book => book.id === id)
    //console.log(book)
    if(book){
      response.json(book)
    } else {
      response.status(404).end()
    }
  })
  
  app.delete('/books/:id', (request, response) => {
    const id = Number(request.params.id)
    books = books.filter(book => book.id !== id)
  
    response.status(204).end()
  })
  //mongoose.connection.close();
  app.listen(port, () => console.log(`Server running on port ${port}`));
  