"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3003/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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

      if (response.status === 201) {
        setEmail("");
        setName("");
        setPassword("");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Internal server error. Please try again later.",
        variant: "error",
      });
    }
  }

  function handleNameChange(e: FormEvent<HTMLInputElement>) {
    setName(e.currentTarget.value);
  }

  function handleEmailChange(e: FormEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  function handlePasswordChange(e: FormEvent<HTMLInputElement>) {
    setPassword(e.currentTarget.value);
  }

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-center">Register</h1>
          <div className="w-full flex items-center justify-center mt-2">
            <h4>
              Do you have an a account?{" "}
              <Link href="/" className="text-blue-500">
                Click here
              </Link>
            </h4>
          </div>
          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                onChange={handleNameChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
