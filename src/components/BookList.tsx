import { Book } from "@/pages";
import React from "react";

type BookListProps = {
  books: Book[];
};

const BookList = ({ books }: BookListProps) => {
  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="list">
      {sortedBooks.map((book) => (
        <div key={book.id} className="card">
          <div className="header">
            <h1>{book.title}</h1>
            <h2>{book.author}</h2>
            <img src={book.coverImgUrl} alt={`Cover of ${book.title}`} />
            <h4>{book.pageCount} pages</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
