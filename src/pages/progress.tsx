import Layout from "@/components/Layout";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";

import ProgressForm, {
  BookProgress,
  type Progress,
} from "@/components/ProgressForm";

const Progress: React.FC = () => {
  const [bookProgressList, setBookProgressList] = useState<BookProgress[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      setAuthError("You are not authorized. Redirecting to login...");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchProgress = async () => {
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
  }, [token]);

  useEffect(() => {
    if (!authError) return;

    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }, [authError, router]);

  const handleUpdateBookProgress = async (formData: Progress) => {
    try {
      const response = await fetch(
        `http://localhost:3001/bookprogress/${formData.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Failed to update book progress");
        return;
      }

      setBookProgressList((prevList) =>
        prevList.map((item) =>
          item.id === formData.id
            ? { ...item, pageProgress: formData.pageProgress }
            : item
        )
      );
      console.log("Progress updated");
    } catch (error) {
      console.log("Something went wrong!", error);
    }
  };

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
              <h2>{progress.book?.title}</h2>
              <p>
                {progress.pageProgress}/{progress.book?.pageCount} pages read
              </p>
              <ProgressForm
                onSubmit={handleUpdateBookProgress}
                progress={progress}
              />
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Progress;
