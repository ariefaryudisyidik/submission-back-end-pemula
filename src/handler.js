const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  let response = {};
  let statusCode = 400;

  if (!name) {
    response = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    };
  } else if (readPage > pageCount) {
    response = {
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    };
  } else {
    response = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    };
    statusCode = 201;
    books.push(newBook);
  }

  return h.response(response).code(statusCode);
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books: books.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    })),
  },
});

module.exports = { addBookHandler, getAllBooksHandler };
