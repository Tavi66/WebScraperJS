var message = 'Hello World!';
console.log(message);

//puppeteer Scrape

//product info object structure
const productObj =
{
    product: 'Product Name',
    url: 'https://url.of.product.com/',
    image: 'https://url.of.product.com/image.jpg',
    price: '$100',
}

const puppeteer = require('puppeteer');

//Amazon Top 50 Lesbian Ebooks
const url = 'https://www.amazon.com/gp/bestsellers/digital-text/6487835011/ref=pd_zg_hrsr_digital-text';

async function fetchProductList(url) {
    const browser = await puppeteer.launch({
        headless: true, //false: displays chrome instance running
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
    console.log('Result:', result);
};

fetchProductList(url);