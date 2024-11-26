"use client";

import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3003/login-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          title: "Error",
          description: data.error || "An error occurred",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message,
        variant: "success",
      });

      localStorage.setItem("token", data.token);
      router.push("/todo-list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Internal server error. Please try again later.",
        variant: "error",
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-center">Login</h1>
          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                onChange={handlePasswordChange}
              />
            </div>

            <div className="w-full flex items-center justify-center">
              <h4>
                Dont have a account?{" "}
                <Link href="/register" className="text-blue-500">
                  Click here
                </Link>
              </h4>
            </div>

            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
