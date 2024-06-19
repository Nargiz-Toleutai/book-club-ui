import { Book } from "@/components/BookList";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BookDetails = () => {
  const router = useRouter();
  const id = router.query.id;
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (id === undefined) {
      return;
    }

    const getBookFromApi = async () => {
      try {
        const response = await fetch(`http://localhost:3001/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    getBookFromApi();
  }, [id]);

  if (!book) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="book-page">
      <h1>{book.title}</h1>
      <img src={book.coverImgUrl} alt={book.title} />
      <h2>The author: {book.author}</h2>
      <h2>Pages: {book.pageCount}</h2>
      {book.bookProgressCount > 0 ? (
        <h4>Current readers: {book.bookProgressCount}</h4>
      ) : (
        <h4>No current readers</h4>
      )}
      {book.averagePageProgress ? (
        <h4>Average page progress: {book.averagePageProgress.toFixed(1)}</h4>
      ) : (
        <h4>No page progress data</h4>
      )}
    </div>
  );
};

export default BookDetails;
