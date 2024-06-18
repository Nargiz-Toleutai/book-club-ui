import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";

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

type RegisterFormData = z.infer<typeof UserDataValidator>;

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserDataValidator),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        router.push("/"); // ${id}??
      } else {
        setError("User already exists. Redirecting to login page...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setError("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Registration</h1>
      <label htmlFor="username">Username</label>
      <input id="username" type="text" {...register("username")} />
      {errors.username && <p>{errors.username.message}</p>}
      <label htmlFor="password">Password</label>
      <input id="password" type="password" {...register("password")} />
      {errors.password && (
        <p className="error-message">{errors.password.message}</p>
      )}
      <button type="submit">Register</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default Register;
