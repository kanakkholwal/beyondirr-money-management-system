"use client";
import { Button } from "@/components/ui/button";
// import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";



export function RegisterForm() {

  return (
    <>
   

            <Button
              type="button"
              className="w-full bg-white">
              <FcGoogle />
              Sigin with Google
            </Button>

    </>
  );
}
