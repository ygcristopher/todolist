"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/assets/logo.png";

function Header() {
  const [initials, setInitials] = useState<string>("");
  const [bgProfile, setBgProfile] = useState<string>("");

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      const user = jwtDecode<{ name: string; bg_profile: string }>(getToken);
      const nameParts = user.name.split(" ");
      const firstLetter = nameParts[0][0].toUpperCase();
      const secondLetter =
        nameParts.length > 1 ? nameParts[1][0].toUpperCase() : "";
      setInitials(firstLetter + secondLetter);
      setBgProfile(user.bg_profile);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="bg-black/80 text-white p-8 flex justify-between items-center rounded">
      <Image src={Logo} alt="logo.png" width={200} />
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarFallback style={{ backgroundColor: bgProfile }}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="left"
            align="start"
            className="bg-white text-black rounded shadow-lg p-2 w-26 cursor-pointer"
          >
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Header;
