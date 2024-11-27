"use client";

import { useToast } from "@/hooks/use-toast";
import { UserLogin } from "@/models/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import api from "@/utils/interceptor";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { Input } from "../ui/input";

function Login() {
  const router = useRouter();
  const { toast } = useToast();

  type FormData = z.infer<typeof UserLogin>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(UserLogin),
  });

  const handleLogin = async (data: FormData) => {
    try {
      const response = await api.post("/login-user", data);
      const loginData = response.data;
      console.log(loginData);

      if (loginData.error) {
        toast({
          title: "Error",
          description: loginData.error || "An error occurred",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: loginData.message,
        variant: "success",
      });

      localStorage.setItem("token", loginData.token);
      reset();
      router.push("/todo-list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Internal server error. Please try again later.",
        variant: "error",
      });
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-4 bg-gray-700 rounded shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Image src={Logo} alt="logo.png" width={200} />
          </div>
          <form className="mt-4 space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Inser your email"
                className="border-2 p-2 rounded text-black bg-white"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="******"
                className="border-2 p-2 rounded text-black bg-white"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="w-full flex items-center justify-center text-white">
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
