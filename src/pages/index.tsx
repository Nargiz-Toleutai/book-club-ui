import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
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
        const response = await fetch("http://localhost:3001/");
        const bookData = await response.json();
        console.log(bookData);
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
      <Layout>{books ? <p>Books</p> : <p>Loading books...</p>}</Layout>
    </>
  );
}
