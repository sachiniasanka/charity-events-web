"use client";
import Image from "next/image";
import loginImg from "@/assets/img/world-hands.png";
import givewellLogo from "@/assets/img/givewell-logo.png";
import { useAuth } from "@/hooks/authContext";
import VerificationForm from "@/components/ui/VerificationForm";
import { CircleArrowLeft } from "lucide-react";

export default function Verify() {
    const { email } = useAuth();
    const handleGoogleLogin = () => {
        console.log("Sign in with Google"); //TODO: add changes here to redirect to google
    };

    return (
        <div className="flex flex-col lg:flex-row justify-around">
            <div className="lg:flex lg:justify-center lg:items-center hidden">
                <Image
                    src={loginImg}
                    width={580}
                    height={575}
                    alt="logo with a world behind the supportive hands"
                    className="border-black border-2"
                ></Image>
            </div>
            <div>
                <div className="lg:flex lg:justify-center lg:items-center lg:z-10 hidden">
                    <Image
                        src={givewellLogo}
                        width={382}
                        height={382}
                        alt="givewell logo"
                    ></Image>
                </div>

                <div className="lg:flex lg:justify-center lg:mt-[-60px] lg:pb-4 mt-40 lg:flex-col">
                    <div className="relative flex items-center mb-4 lg:hidden">
                        <CircleArrowLeft
                            className="absolute -top-10 left-1 w-9 h-9 cursor-pointer text-gray-500"
                            onClick={() => (window.location.href = "/login")}
                        />
                    </div>
                    <p className="text-2xl font-bold flex justify-center items-center lg:mb-0 lg:pb-0">
                        Enter the Verification Code
                    </p>
                    <div className="flex justify-center items-center">
                        <p className="mb-6">
                            We have sent a code to{" "}
                            {email?.slice(0, email.indexOf("@") - 3) +
                                "*".repeat(3) +
                                "***" +
                                email.slice(email.indexOf("@"))}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full px-4 mb-9">
                    <VerificationForm />
                </div>
            </div>
        </div>
    );
}
