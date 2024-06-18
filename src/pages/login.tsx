import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface User {
  id: number;
}

const Login = ({ id }: User) => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage !== null) {
      router.push("/");
    }
  }, [router]);

  const onSubmitTheForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const result = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await result.json();
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        router.push("/"); // ${id}??
      } else {
        setError("User does not exist. Redirecting to registration...");
        setTimeout(() => {
          router.push("/register");
        }, 3000);
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setError("Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <form className="login-window" onSubmit={onSubmitTheForm}>
        <h1>Login</h1>
        <label>Username</label>
        <input
          type="text"
          required={true}
          onChange={(event) => setUserName(event.target.value)}
          value={userName}
          className="input"
          name="username"
        />
        <label>Password</label>
        <input
          type="password"
          required={true}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input"
          name="password"
        />
        <button type="submit" className="login-button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
