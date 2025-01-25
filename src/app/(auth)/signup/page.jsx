"use client";
import Image from "next/image";
import signupImg from "@/assets/img/hands-heart.png";
import givewellLogo from "@/assets/img/givewell-logo.png";
import SignupForm from "@/components/ui/SignupForm";
import { Button } from "@/components/ui/Button";
import googleColorIcon from "@/assets/img/google-color.png";

export default function Signup() {
    const handleGoogleLogin = () => {
        console.log("Sign in with Google"); //TODO: add changes here to redirect to google
    };

    return (
        <div className="flex flex-col lg:flex-row justify-around">
            <div className="flex justify-center items-center">
                <div className="lg:border-black lg:border-2 size-[580] flex items-center">
                    <Image
                        src={signupImg}
                        alt="logo with a world behind the heart made out of hands"
                        width={580}
                        height={580}
                    ></Image>
                </div>
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
                    <SignupForm></SignupForm>
                </div>
                <div className="flex items-center justify-center w-full my-4">
                    <div className="border-t border-gray-500 w-[180px]"></div>
                    <div className="px-4 text-gray-500 text-sm">OR</div>
                    <div className="border-t border-gray-500 w-[180px]"></div>
                </div>
                <div className="flex flex-col justify-center items-center w-full px-4">
                    {/* <Button                        deactivated due to higher management decision
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
                        Already have an account?{" "}
                        <a
                            href="login"
                            className="text-mint-800 underline hover:text-mint-600 font-bold"
                        >
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
