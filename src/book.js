//Axios
//puppeteer 
//import * as puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
//Amazon Top 50 Lesbian Ebooks
///const url = 'https://www.amazon.com/gp/bestsellers/digital-text/6487835011/ref=pd_zg_hrsr_digital-text';

//Get best selling items' info 
async function fetchBestSellingList() {
const url = 'https://www.amazon.com/gp/bestsellers/digital-text/6487835011/ref=pd_zg_hrsr_digital-text';
    const browser = await puppeteer.launch({
        headless: false, //false: displays chrome instance running
        defaultViewport: null, //(optional) useful in headless mode
    });

    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    //compile search results
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
    return result;
};

//let bookList = fetchBestSellingList(url);

// bookList.then(response => {
//   //console.log('response: ',response);
//   response.forEach(book => {
//     //const request = axios.post(baseUrl, book);
//     console.log(book);
//     // axios.post(baseUrl,book)
//     // .then(response => console.log(response))
//     // .catch(error=>console.log(error));
//     //list.concat(book);
//   })
// });
// axios.get(baseUrl)
// .then(response => console.log('response: ', response.data))
// .catch(console.log('error'));
// const create = newObject => {
//   const request = axios.post(baseUrl, newObject)
//   return request.then(response => response.data)
// }

// async function addBook()
// {return await axios

// .catch(console.log('error adding entry.'));}
// addBook();

//  console.log('booklist: ', list);