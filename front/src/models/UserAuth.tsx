"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  exp: number;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch {
    return true;
  }
};

export default function UserAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}
