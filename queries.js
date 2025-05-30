const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri)

async function runAllQueries(){

   try{
    const client = new MongoClient(uri)
    await client.connect()

    const dbName = 'plp_bookstore'; 
    const collectionName = 'books';

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    console.log(`mongodb connected successfully...`)
     //1. Find all books:
   const allBooks = await collection.find({}).toArray()
   allBooks.forEach((Book, index)=>{
    console.log(`${index + 1}. ${Book.title} by ${Book.author} (${Book.published_year}) - ${Book.genre} - $${Book.price}`);
   })
    
    //2. Find books by a specific author:
    const authorGeorge = await collection.find({ author: "George Orwell" }).toArray()
    authorGeorge.forEach((book, index)=>{
        console.log(`${index + 1}. ${book.author} is the author of  ${book.title}`)
    })
    
    //Find books published after 1950:
    const published_after_1950 = await collection.find({ published_year: { $gt: 1950 } }).toArray()
    published_after_1950.forEach((book, index)=>{
        console.log(`\nThe books published after 1950 are, ${index+1}. ${book.title} in ${book.published_year}`)
    })
    
    //Find books in a specific genre:
    const fictionGenres = await collection.find({ genre: "Fiction" }).toArray()
    fictionGenres.forEach((book, index)=>{
        console.log(`\nbooks in a ${book.genre} genre: ${index+1}. ${book.title}`)
            })

        //Find in-stock books:
    const in_StockBooks = await collection.find({ in_stock: true }).toArray()
    //console.log(`\nThe in-stock books are:`,in_StockBooks)
    in_StockBooks.forEach((book, index)=>{
        console.log(`\nThe in-stock books are: ${index+1}. ${book.title} by ${book.author} (${book.published_year}) - ${book.genre} - $${book.price}`);
    }) 

   // Updating books by Harper Lee to have genre "Non Fiction"
    const updateGenres = await collection.updateMany(
    { author: "Harper Lee" }, 
    { $set: { genre: "Non Fiction" } } 
    );

    console.log(`\n${updateGenres.modifiedCount} book(s) by Harper Lee updated to genre 'Non Fiction'.`);


//delete books with price less than $10
    const deleteBooks = await collection.deleteMany({ price: { $lt: 10 } });
    console.log(`\n${deleteBooks.deletedCount} book(s) with price less than $10 deleted.`);

    //Count the number of books in the collection
    const bookCount = await collection.countDocuments();
    console.log(`\nTotal number of books in the collection: ${bookCount}`);

    //Find books with a specific title
    const specificTitle = await collection.find({ title: "1984" }).toArray();
    if (specificTitle.length > 0) {
        console.log(`\nFound book(s) with title '1984':`);
        specificTitle.forEach((book, index) => {
            console.log(`${index + 1}. ${book.title} by ${book.author}`);
        });
    } else {
        console.log(`\nNo books found with title '1984'.`);
    }
   }catch(err){
    console.log(`sorry we encountered an error: ${err.message}`);
   }finally{
         await client.close();
         console.log('database operation completed');
   }
 


}
runAllQueries().catch(console.error);

module.exports = {runAllQueries}