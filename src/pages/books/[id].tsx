import { Book } from "@/components/BookList";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

interface UserData {
  userId: number;
}

export const ProgressDataValidator = z
  .object({
    bookId: z.number(),
    userId: z.preprocess((val) => Number(val), z.number().int().positive()),
    pageProgress: z.number(),
  })
  .strict();

type Progress = z.infer<typeof ProgressDataValidator>;

const BookDetails = ({ userId }: UserData) => {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [bookProgress, setBookProgress] = useState<Progress | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized.");
    }
  }, [id]);

  useEffect(() => {
    if (!token) return;

    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/books/${id}`, {
          method: "GET",
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
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id, token]);

  if (authError) {
    return (
      <Layout>
        <div>{authError}</div>
      </Layout>
    );
  }

  const handleCreateBookProgress = async () => {
    if (!token) return;
    if (bookProgress?.bookId) {
      console.log("Book is already in the reading list");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/bookprogress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: Number(id),
          userId,
          pageProgress: 0,
        }),
      });
      if (!response.ok) {
        console.error("Failed to create book progress");
        return;
      }
      const responseData = await response.json();
      setBookProgress(responseData);
      console.log("Book successfully added");
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
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
        {token && bookProgress ? (
          <div>The book in the list</div>
        ) : (
          <button onClick={handleCreateBookProgress}>Start reading book</button>
        )}
        {bookProgress?.pageProgress !== undefined && (
          <h4>Page progress: {bookProgress.pageProgress}</h4>
        )}
        {book.averagePageProgress !== null ? (
          <h4>Average page progress: {book.averagePageProgress.toFixed(1)}</h4>
        ) : (
          <h4>No page progress data</h4>
        )}
      </div>
    </Layout>
  );
};

export default BookDetails;
