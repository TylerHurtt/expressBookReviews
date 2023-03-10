const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "username", password: "password"}, {username: "otherUser", password: "otherPassword"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    return users.find((user) => user.username === username && user.password == password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { author, title } =  books[isbn];
  const { username } =  req.session.authorization
  const { review } = req.body;

  books[isbn].reviews[{
    username: review
  }]
  
  return res.status(200).json({message: `added ${username}'s review "${review}" to ${title} by ${author}`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { author, title } =  books[isbn];
  const { username } = req.session.authorization;

  delete books[isbn].reviews[username];
  
  return res.status(200).json({message: `removed ${username}'s review from ${author}'s ${title}`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
