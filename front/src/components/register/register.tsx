"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRegister } from "@/models/validationSchemas";
import Link from "next/link";
import api from "@/utils/interceptor";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { Input } from "../ui/input";

function Register() {
  const { toast } = useToast();
  const router = useRouter();

  type FormData = z.infer<typeof UserRegister>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(UserRegister),
  });

  async function handleRegister(data: FormData) {
    try {
      const response = await api.post("/create-user", data);

      const responseData = response.data;

      if (responseData.error) {
        toast({
          title: "Error",
          description: responseData.error || "An error occurred",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: responseData.message,
        variant: "success",
      });

      if (response.status === 201) {
        reset();
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

  return (
    <div>
      <div className=" min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md p-4 bg-gray-700 rounded shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <Image src={Logo} alt="logo.png" width={200} />
          </div>
          <div className="w-full flex items-center justify-center mt-2 text-white">
            <h4>
              Do you have an a account?{" "}
              <Link href="/" className="text-blue-500">
                Click here
              </Link>
            </h4>
          </div>
          <form
            className="mt-4 space-y-6"
            onSubmit={handleSubmit(handleRegister)}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Name
              </label>
              <Input
                type="text"
                className="border-2 p-2 rounded text-black bg-white"
                placeholder="Insert your name"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <Input
                type="email"
                className="border-2 p-2 rounded text-black bg-white"
                placeholder="Insert your email"
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
                className="border-2 p-2 rounded text-black bg-white"
                placeholder="******"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
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
