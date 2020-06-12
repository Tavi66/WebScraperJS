
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser  = require('body-parser');

const app = express();
const port = process.envPORT || 3001;

const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
//const db = require('mongodb').db;
if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node server.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const mongoUrl = `mongodb+srv://tavi:${password}@cluster0-uo1y8.mongodb.net/books?retryWrites=true&w=majority`;
//const Book = require('./models/book');
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

app.use(cors());
app.use(bodyParser.json());

// const generateId = () => {
//     const maxId = books.length > 0 ? 
//     Math.max(...books.map(n => n.id)) : 0
  
//     return maxId + 1
//   }
  
 
  app.get('/',(request,response) => {
    console.log('get /');
  });

  //insertMany Books
  app.post('/api/books',(request,response) => {
    const books = request.body;
    const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
    client.connect(err => {
      console.log('Connected to client.');
      const collection = client.db("books").collection("books");
      collection.insertMany(books)
      .then(res => {
        console.log('Added documents!');
        console.log(res);
        mongoose.connection.close().then(console.log('mongoDB connection closed.'));
      })
      .catch(error => {
        console.log('error adding documents: ',error);
        mongoose.connection.close().then(console.log('mongoDB connection closed.'));
      });
    });
    client.close();

    });

  //get books data from database
  app.get('/api/books',(request,response) => {
    const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
    client.connect(err => {
      console.log('Connected to client.');
      const collection = client.db("books").collection("books");
      collection.find({})
      .toArray(function(error, result) {
        console.log('Retrieving Documents...');
        if (error) { client.close();
          throw error;}
        //console.log(result);
        console.log('Retrieved Documents!');
        response.send(result);
      })
    });
    client.close();
  });
    // MongoClient.connect(mongoUrl, {useUnifiedTopology:true}, function(error, db) {
    //   const dbo = db.db("books");
    //   dbo.collection("books").find({})
    //   .toArray(function(error, result) {
    //     if (error) throw error;
    //     console.log(result)
    //     response.json(result);
    //     db.close();
    //   })
    //   .then(books => {
    //         mongoose.connection.close();
    //    })    
    //    .catch(error => {
    //     console.log('error fetching documents: ',error);
    //     mongoose.connection.close().then(console.log('mongoDB connection closed.'));
    //   });
    //  });

  //  });

  app.get('/books', (request, response) => {
    //scrape Top 50 Lesbian Books
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
             _id:"",
              rank: "",
              //name: "",
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
          book._id =  infoArr[1];
          book.rank = infoArr[0]; //best-selling rank
          //book.name = infoArr[1]; //Title of book
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

  })
  
  app.get('/tech', (request, response) => {
    //scrape Top 50 Electronics
    const url = 'https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics/ref=zg_bs_electronics_home_all?pf_rd_p=65f3ea14-1275-4a7c-88f8-1422984d7577&pf_rd_s=center-2&pf_rd_t=2101&pf_rd_i=home&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=BDN2FAN4QNTR6QMAC7YK&pf_rd_r=BDN2FAN4QNTR6QMAC7YK&pf_rd_p=65f3ea14-1275-4a7c-88f8-1422984d7577';
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
      let list = [];

      for(let i = 0;  i < totalSearchResults - 1; i++) {
         //book info object structure
          let item = {
            _id: "",
            info: "",
              rank: "",
              //name: "",
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
        let infoArr = Array.from(productsDetails[i].split("\n"));//

        //Save product data to book object
          item._id = infoArr[1]; //id of book
          item.rank = infoArr[0]; //best-selling rank
          //item.name = infoArr[1]; //Title of book
          item.rating = infoArr[2]; //Current Amazon rating of book
          item.price = infoArr[4]; //Current price of book
          list = list.concat(item);
        }
        //console.log(list);
      return list;
    })
    //console.log('Result:', result);
    await browser.close();

    response.send(result);
    })

  })
  app.delete('/books/:id', (request, response) => {
    //const id = Number(request.params.id)
    //books = books.filter(book => book.id !== id)
  
    response.status(204).end()
  })
  //mongoose.connection.close();
  app.listen(port, () => console.log(`Server running on port ${port}`));