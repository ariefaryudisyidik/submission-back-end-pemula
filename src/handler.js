const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
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
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
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

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    const keyword = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(keyword));
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const response = {
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };

  return h.response(response);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = {
    status: 'fail',
    message: 'Buku tidak ditemukan',
  };

  return h.response(response).code(404);
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (!name) {
      const response = {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      };

      return h.response(response).code(400);
    }

    if (readPage > pageCount) {
      const response = {
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      };

      return h.response(response).code(400);
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };

    return h.response(response).code(200);
  }

  const response = {
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  };

  return h.response(response).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };

    return h.response(response).code(200);
  }

  const response = {
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  };

  return h.response(response).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
