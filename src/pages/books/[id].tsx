import { Book } from "@/components/BookList";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface BookProgressData {
  bookId: number;
  userId: number;
  pageProgress: number;
}

interface UserData {
  userId: number;
}

const BookDetails = ({ userId }: UserData) => {
  const router = useRouter();
  const id = router.query.id;
  const [book, setBook] = useState<Book | null>(null);
  const [bookProgress, setBookProgress] = useState<BookProgressData | null>(
    null
  );
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (id === undefined) {
      return;
    }
    const getBookFromApi = async () => {
      try {
        const response = await fetch(`http://localhost:3001/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch book");
          return;
        }
        const data = await response.json();
        setBook(data);
        getBookProgress(data.id);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    const getBookProgress = async (bookId: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/bookprogress?userId=${userId}&bookId=${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const progressData = await response.json();
          setBookProgress(progressData);
        }
      } catch (error) {
        console.error("Error fetching book progress:", error);
      }
    };

    getBookFromApi();
  }, [id, token, userId]);

  const handleCreateBookProgress = async (data: BookProgressData) => {
    try {
      const response = await fetch("http://localhost:3001/bookprogress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error("Failed to create book progress");
        return;
      }
      const responseData = await response.json();
      console.log(responseData);
      setBookProgress(responseData);
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  if (!book) {
    return <div>Loading ...</div>;
  }

  return (
    <Layout>
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
        {token ? (
          bookProgress ? (
            <h4>Book is on your reading list</h4>
          ) : (
            <button
              onClick={() =>
                handleCreateBookProgress({
                  bookId: Number(book.id),
                  userId: userId,
                  pageProgress: 0,
                })
              }
            >
              Start reading book
            </button>
          )
        ) : (
          <h4>Please log in to read this book</h4>
        )}
        {bookProgress !== null && bookProgress.pageProgress > 0 && (
          <h4>Page progress: {bookProgress.pageProgress}</h4>
        )}
        {book.averagePageProgress > 0 && (
          <h4>Average page progress: {book.averagePageProgress.toFixed(1)}</h4>
        )}
      </div>
    </Layout>
  );
};

export default BookDetails;
