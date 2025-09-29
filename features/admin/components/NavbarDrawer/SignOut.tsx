"use client";
import { signOut } from "next-auth/react";
import { LogIn } from "lucide-react";

const SignOut = () => {
    return (
        <button className="justify-center text-base" onClick={() => signOut({ callbackUrl: `/auth/secure/gateway/login`})}>
            <LogIn size={18}/>
            ออกจากระบบ
        </button>
    )
}

export default SignOut