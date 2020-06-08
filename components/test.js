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

//Demo url: https://www.amazon.in/s?k=Shirts&ref=nb_sb_noss_2
const url = 'https://www.amazon.in/s?k=Shirts&ref=nb_sb_noss_2';

async function fetchProductList(url) {
    const browser = await puppeteer.launch({
        headless: true, //false: displays chrome instance running
        defaultViewport: null, //(optional) useful in headless mode
    });

    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});

    //compile search results
    await page.waitFor('div[data-cel-widget^="search_result_"]');

    const result = await page.evaluate(()=> {
      //total product amount
      //let totalSearchResults = Array.from(document.querySelectorAll('div[data-cel-widget^="search_result_"]')).length;
      let totalSearchResults = Array.from(document.querySelectorAll('div[data-cel-widget^="search_result_"]')).length;

      let productList = [];

      for(let i = 1;  i < totalSearchResults - 1; i++) {
          let product = {
              product: '',
          }

          let onlyProduct = false;
          let emptyProductMeta = false;

          //transverse search results for product names
          //getting product items with specific classes
            let productNodes = Array.from(document.querySelectorAll(`div[data-cel-widget="search_result_${i}"] .a-size-base-plus.a-color-base`));

          //empty product list nodes returned
          if(productNodes.length === 0) {
              productNodes = Array.from(document.querySelectorAll(`div[data-cel-widget="search_result_${i}"] .a-size-medium.a-color-base.a-text-normal`));
              productNodes.length > 0 ? onlyProduct = true :  emptyProductMeta = true; 
          }
          
          let productsDetails = productNodes.map(el => el.innerText); 

          if(!emptyProductMeta){
              product.product = onlyProduct ? productsDetails[0]: productsDetails[1];
          }
          
          if (typeof product.product != 'undefined') {
              !product.product.trim() ? null :  productList = productList.concat(product);
          }
    
      }
      return productList;
    })
    console.log('Result:', result);
};

fetchProductList(url);