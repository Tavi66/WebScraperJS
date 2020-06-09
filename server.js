
const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const port = process.envPORT || 3001;
const puppeteer = require('puppeteer');
const cors = require('cors');
let books = [];

app.use(cors())
app.use(bodyParser.json())

const generateId = () => {
    const maxId = books.length > 0 ? 
    Math.max(...books.map(n => n.id)) : 0
  
    return maxId + 1
  }
  
 
  app.get('/',(request,response) => {
      const url = 'https://www.amazon.com/gp/bestsellers/digital-text/6487835011/ref=pd_zg_hrsr_digital-text';
      // const browser = await puppeteer.launch({
      //     headless: false, //false: displays chrome instance running
      //     defaultViewport: null, //(optional) useful in headless mode
      // });
      puppeteer.launch().then(async function(browser) {
      const page = await browser.newPage();
      await page.goto(url, {waitUntil: 'networkidle2'});
      await page.waitFor('ol.a-ordered-list.a-vertical');
      const result = await page.evaluate(()=> {
        //total product amount
        let totalSearchResults = Array.from(document.querySelectorAll('li.zg-item-immersion')).length;
        let bookList = [];
  
        for(let i = 0;  i < totalSearchResults - 1; i++) {
           //book info object structure
            let book = {
                rank: '',
                name: '',
                author: '',
                rating: '',
                //published: '',
                //description: '',
                //image: '',
                price: '',
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
  
  
  app.get('/books',(request,response) => {
      response.json(books)
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
  
  app.listen(port, () => console.log(`Server running on port ${port}`));
  