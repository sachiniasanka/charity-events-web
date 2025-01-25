"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import passwordIcon from "@/assets/img/password-icon.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Image
                    src={passwordIcon}
                    alt="password icon"
                    width={20}
                    height={20}
                    className="object-contain"
                />
            </div>
            <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={cn(
                    "pl-10 placeholder:text-gray-500 border-mint-500 py-6",
                    className
                )}
                ref={ref}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5 text-black transform scale-x-[-1]" />
                ) : (
                    <Eye className="h-5 w-5 text-black" />
                )}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
