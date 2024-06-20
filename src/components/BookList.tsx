import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

export interface Book {
  id: string;
  title: string;
  coverImgUrl: string;
  author: string;
  pageCount: number;
  bookProgressCount: number;
  averagePageProgress: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3001/books");
        const data = await response.json();
        const booksWithCount = data.map((book: any) => ({
          ...book,
          bookProgressCount: book._count.bookProgress,
        }));

        setBooks(booksWithCount);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const sortByPopularity = useCallback(() => {
    const sorted = [...books].sort(
      (a, b) => b.bookProgressCount - a.bookProgressCount
    );
    setSortedBooks(sorted);
  }, [books]);

  const sortByName = useCallback(() => {
    const sorted = [...books].sort((a, b) => a.title.localeCompare(b.title));
    setSortedBooks(sorted);
  }, [books]);

  useEffect(() => {
    if (books.length > 0) {
      sortByName();
    }
  }, [books, sortByName]);

  return (
    <div>
      <button onClick={sortByPopularity}>Sort by Popularity</button>
      <button onClick={sortByName}>Sort by Name</button>
      <ul>
        {sortedBooks.map((book) => (
          <li key={book.id}>
            <h3>
              <Link href={`/books/${book.id}`}>{book.title}</Link>
            </h3>
            <img src={book.coverImgUrl} alt={book.title} />
            <p>{book.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
