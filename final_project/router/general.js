const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (isValid(username)) {
    return res.status(409).json({message: "User already exists!"});
  }
  users.push({ username, password });
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const result = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === req.params.author) result[isbn] = books[isbn];
  });
  res.send(JSON.stringify(result, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const result = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === req.params.title) result[isbn] = books[isbn];
  });
  res.send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  res.send(books[isbn].reviews);
});

// ---------- Tasks 10-13: Axios with async/await and Promise callbacks ----------

// Task 10: Get all books - async/await with Axios
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({message: "Error fetching books", error: err.message});
  }
});

// Task 11: Get book details by ISBN - Promise callbacks with Axios
public_users.get('/async/isbn/:isbn', (req, res) => {
  axios.get(`${BASE_URL}/isbn/${encodeURIComponent(req.params.isbn)}`)
    .then(response => res.send(response.data))
    .catch(err => res.status(404).json({message: "Book not found", error: err.message}));
});

// Task 12: Get book details by author - async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(req.params.author)}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({message: "Error fetching books by author", error: err.message});
  }
});

// Task 13: Get book details by title - async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(req.params.title)}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({message: "Error fetching books by title", error: err.message});
  }
});

module.exports.general = public_users;
