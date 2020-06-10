const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const mongoUrl = `mongodb+srv://tavi:${password}@cluster0-uo1y8.mongodb.net/books?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => console.log('connected to MongoDB'))
.catch(error => console.log('error connecting to mongoDB: ', error));

//const Book = mongoose.model('Book', bookSchema);
const Book = require('./models/book');

// const book = new Book({
//     rank:"#1",
//     name:"The Woman in 3B",
//     author:"Eliza Lentzski",
//     rating:"4.7 out of 5 stars",
//     price:"$3.99"    
// })

Book.find({}).then(result => {
    result.forEach(book => {
        console.log(book);
    })
    mongoose.connection.close();
})
// book.save().then(result =>{
//     console.log('book saved!');
//     mongoose.connection.close();
// }).catch(error=>console.log('error: ', error))