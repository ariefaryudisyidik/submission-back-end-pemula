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

  books.push(newBook);

  let response = {};
  let statusCode = 0;
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!name) {
    response = {
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    };
    statusCode = 400;
  } else if (readPage > pageCount) {
    response = {
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    };
    statusCode = 400;
  } else if (isSuccess) {
    response = {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    };
    statusCode = 201;
  } else {
    response = {
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    };
    statusCode = 500;
  }

  return h.response(response).code(statusCode);
};

module.exports = { addBookHandler };
