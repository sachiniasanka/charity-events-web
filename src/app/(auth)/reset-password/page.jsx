"use client";
import Image from "next/image";
import loginImg from "@/assets/img/world-hands.png";
import givewellLogo from "@/assets/img/givewell-logo.png";
import ResetPasswordForm from "@/components/ui/ResetPasswordForm";
import { Button } from "@/components/ui/Button";
import { CircleArrowLeft } from "lucide-react";

export default function ResetPassword() {
    return (
        <div className="flex flex-col lg:flex-row justify-around">
            <div className="lg:flex justify-center items-center hidden">
                <Image
                    src={loginImg}
                    alt="logo with a world behind the supportive hands"
                    width={580}
                    height={575}
                    className="border-black border-2 "
                ></Image>
            </div>
            <div>
                <div className="lg:flex justify-center items-center z-10 hidden">
                    <Image
                        src={givewellLogo}
                        alt="givewell logo"
                        width={382}
                        height={382}
                    ></Image>
                </div>
                <div className="lg:flex lg:justify-center lg:mt-[-60px] lg:pb-4 mt-40">
                    <div className="relative flex items-center mb-4 lg:hidden">
                        <CircleArrowLeft
                            className="absolute -top-10 left-1 w-9 h-9 cursor-pointer text-gray-500"
                            onClick={() => (window.location.href = "login")}
                        />
                    </div>
                    <p className="flex justify-center items-center text-2xl font-semibold mb-20 lg:mb-0 lg:pb-10">
                        Reset Your Password
                    </p>
                </div>
                <div className="flex justify-center items-center px-4">
                    <ResetPasswordForm></ResetPasswordForm>
                </div>

                <div className="flex flex-col justify-center items-center w-full px-4 mb-9">
                    <Button
                        onClick={() => (window.location.href = "/login")}
                        className="w-full max-w-sm rounded-3xl py-6 text-lg border-mint-500"
                        variant="outline"
                    >
                        CANCEL
                    </Button>
                </div>
            </div>
        </div>
    );
}
