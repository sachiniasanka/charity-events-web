"use client";
import Image from "next/image";
import loginImg from "@/assets/img/world-hands.png";
import givewellLogo from "@/assets/img/givewell-logo.png";
import LoginForm from "@/components/ui/LoginForm";
import { Button } from "@/components/ui/Button";
import googleColorIcon from "@/assets/img/google-color.png";

export default function Login() {
    const handleGoogleLogin = () => {
        console.log("Sign in with Google"); //TODO: add changes here to redirect to google
    };

    return (
        <div className="flex flex-col lg:flex-row justify-around">
            <div className="flex justify-center items-center">
                <Image
                    src={loginImg}
                    alt="logo with a world behind the supportive hands"
                    width={580}
                    height={575}
                    className="lg:border-black lg:border-2"
                ></Image>
            </div>
            <div>
                <div className="flex justify-center items-center z-10">
                    <Image
                        src={givewellLogo}
                        alt="givewell logo"
                        width={382}
                        height={382}
                    ></Image>
                </div>
                <div className="flex justify-center items-center px-4 mt-[-60px]">
                    <LoginForm></LoginForm>
                </div>
                <div className="flex items-center justify-center w-full my-4">
                    <div className="border-t border-gray-500 w-[180px]"></div>
                    <div className="px-4 text-gray-500 text-sm">OR</div>
                    <div className="border-t border-gray-500 w-[180px]"></div>
                </div>
                <div className="flex flex-col justify-center items-center w-full px-4">
                    {/* <Button                                   deactivated this because of higher management decision
                        onClick={handleGoogleLogin}
                        className="w-full max-w-sm rounded-3xl py-6 text-lg"
                        variant="outline"
                    >
                        <Image
                            src={googleColorIcon}
                            alt="google icon"
                            width={20}
                        ></Image>
                        Sign in with Google
                    </Button> */}
                    <div className="mt-4 pb-6 w-full text-center">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="text-mint-800 underline hover:text-mint-600 font-bold"
                        >
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
