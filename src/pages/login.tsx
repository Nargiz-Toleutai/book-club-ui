import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const UserDataValidator = z
  .object({
    username: z.string().min(5, {
      message: "Username should have a minimum length of 5 characters",
    }),
    password: z.string().min(10, {
      message: "Password should have a minimum length of 10 characters",
    }),
  })
  .strict();

type User = z.infer<typeof UserDataValidator>;

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserDataValidator),
  });

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage !== null) {
      router.push("/");
    }
  }, [router]);

  const handleFormSubmit = async (data: User) => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      const result = await response.json();
      localStorage.setItem("token", result.token);
      console.log("Logged in");
      router.push("/");
    } catch (error) {
      console.log("Something went wrong!");
      setError(
        "Login failed. Please check your username or password and try again."
      );
    }
  };

  return (
    <div className="login-page">
      <form className="login-window" onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>Login</h1>
        <label>Username</label>
        <input
          type="text"
          id="username"
          {...register("username")}
          className={`${errors.username ? "error-input" : ""}`}
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}
        <label>Password</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className={`${errors.password ? "error-input" : ""}`}
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
        <button type="submit" className="login-button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
