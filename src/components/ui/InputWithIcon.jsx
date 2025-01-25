import * as React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export const InputWithIcon = React.forwardRef(
    ({ className, iconSrc, alt, type, ...props }, ref) => {
        return (
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                        src={iconSrc}
                        alt={alt}
                        width={20}
                        height={20}
                        className="object-contain"
                    />
                </div>
                <Input
                    className={cn(
                        "pl-10 placeholder:text-gray-500 border-mint-500 py-6",
                        className
                    )}
                    type={type}
                    {...props}
                    ref={ref}
                />
            </div>
        );
    }
);
InputWithIcon.displayName = "InputWithIcon";
