const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  console.log(req.body)
  const { username, password } = req.body;
  console.log({ username, password })
  if (username && password) {
    if (!doesExist(username)) {
      users.push({username, password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  return res.status(200).json({message: book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const booksArray = Object.values(books);
  const authorsBooks = booksArray.filter((b) => b.author === author);
  return res.status(200).json({message: authorsBooks});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const booksArray = Object.values(books);
  const titledBooks = booksArray.filter((b) => b.title === title);
  console.log({title, booksArray, titledBooks})
  return res.status(200).json({message: titledBooks});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const { reviews } = books[isbn];
  return res.status(200).json({message: reviews});
});

module.exports.general = public_users;
