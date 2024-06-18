import BookList from "@/components/BookList";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { z } from "zod";

const BookValidator = z.object({
  id: z.number().int(),
  title: z.string(),
  coverImgUrl: z.string(),
  author: z.string(),
  pageCount: z.number(),
});

export type Book = z.infer<typeof BookValidator>;

const bookArrayValidator = z.array(BookValidator);

export default function Home() {
  const [books, setBooks] = useState<Book[] | null>(null);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetch("http://localhost:3001/books");
        const bookData = await response.json();
        const parsedBooks = bookArrayValidator.safeParse(bookData);

        if (parsedBooks.success) {
          setBooks(parsedBooks.data);
        } else {
          console.error("Validation failed", parsedBooks.error);
        }
      } catch (error) {
        console.log("Error in HTTP request");
      }
    };
    getBooks();
  }, []);
  return (
    <>
      <Layout>
        {books ? <BookList books={books} /> : <p>Loading books...</p>}
      </Layout>
    </>
  );
}
