const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({username, password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await books
        res.status(200).json({ message: allBooks });
    } catch (error) {
        res.status(400).json({ message: 'cannot get books' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  books.then(allBooks => {
    const book = allBooks[isbn];
    if (book) {
      res.status(200).json({message: book}); 
    } else {
      res.status(404).json({message: 'book not found'});
    }
  });
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const allBooks = await books
    const booksArray = Object.values(allBooks);
    const authorsBooks = booksArray.filter((b) => b.author === author);
    return res.status(200).json({message: authorsBooks});
  } catch(error) {
    res.status(404).json({message: `books by ${author} could not be found`});
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const allBooks = await books;
    const booksArray = Object.values(allBooks);
    const titledBooks = booksArray.filter((b) => b.title === title);
    return res.status(200).json({message: titledBooks});
  } catch(error) {
    res.status(404).json({message: `books titled ${titled} could not be found`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    const { isbn } = req.params;
    const allBooks = await books;
    const { reviews } = allBooks[isbn];
    return res.status(200).json({message: reviews});
  } catch(error) {
    res.status(404).json({message: `book review of book with ISBN ${isbn} could not be found`});
  }
});

module.exports.general = public_users;
