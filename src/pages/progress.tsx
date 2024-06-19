import BookList, { Book } from "@/components/BookList";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { z } from "zod";
import { BookProgressData } from "./books/[id]";
import { useRouter } from "next/router";

const Progress = () => {
  const [bookProgressList, setBookProgressList] = useState<BookProgressData[]>(
    []
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProgress = async () => {
      if (!token) {
        setAuthError("You are not authorized. Redirecting to login...");
        return;
      }
      try {
        const response = await fetch("http://localhost:3001/my-progress", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setBookProgressList(data);
      } catch (error) {
        console.error("Failed to fetch progress", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    if (!authError) return;

    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }, [authError, router]);

  if (authError) {
    return (
      <Layout>
        <div>{authError}</div>
      </Layout>
    );
  }

  if (!bookProgressList.length) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="progress-page">
        <h1>Your Reading Progress</h1>
        <ul>
          {bookProgressList.map((progress) => (
            <li key={progress.bookId}>
              <h2>{progress.book.title}</h2>
              <p>
                {progress.pageProgress}/{progress.book.pageCount} pages read
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Progress;
