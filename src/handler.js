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
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
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
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
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

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
};
