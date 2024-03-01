import express from "express"
import { PORT } from "./config/constants.js"
import isEmpty from "./utils/isEmpty.js"

let books = [
  { id: "1", title: "Book 1" },
  { id: "2", title: "Book 2" },
  { id: "3", title: "Book 3" },
  { id: "4", title: "Book 4" },
]

const app = express({})
app.use(express.json())

app.get("/book/:bookId", (req, res) => {
  try {
    const bookId = req.params.bookId
    if (!bookId) return res.status(403).json("Book id is missing")

    const book = books.find((book) => book.id === bookId)
    if (!book) return res.status(404).json("Book not found")

    res.json(book)
  } catch (error) {
    res.status(505).send(error)
  }
})

app.post("/book", (req, res) => {
  try {
    const book = req.body

    if (isEmpty(book)) return res.status(400).json("Body is empty")
    if (!book.title) return res.status(400).json("Title is missing")

    books.push({ id: `${books.length + 1}`, title: book.title })
    res.json({ books })
  } catch (error) {
    res.status(500).json({ error })
  }
})

app.put("/book/:bookId", (req, res) => {
  try {
    const bookId = req.params.bookId
    if (!bookId) return res.status(403).json("Book id is missing")

    const bookData = req.body
    if (isEmpty(bookData)) return res.status(400).json("Body is empty")
    if (!bookData.title) return res.status(400).json("Title is missing")

    let foundBook = books.find((book) => book.id === bookId)
    if (!foundBook) return res.status(404).json("Book not found")

    books = books.map((book) => {
      if (book.id !== bookId) return book
      return { ...book, ...bookData }
    })
    res.json(books)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.delete("/book/:bookId", (req, res) => {
  try {
    const bookId = req.params.bookId
    if (!bookId) return res.status(403).json("Book id is missing")

    let foundBook = books.find((book) => book.id === bookId)
    if (!foundBook) return res.status(404).json("Book not found")

    books = books.filter((book) => book.id !== bookId)
    res.json(books)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.listen(PORT, () => {
  console.log("Server is running")
})
