"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/Form";
import { PasswordInput } from "@/components/ui/PasswordInput";
import checkIcon from "@/assets/img/check-icon.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/authContext";
import Swal from "sweetalert2";

// Define the form schema
const formSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Password must contain at least 1 special character"
            )
            .regex(
                /(?=.*[a-z])(?=.*[A-Z])/,
                "Password must contain at least 1 uppercase and 1 lowercase letter"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match.",
        path: ["confirmPassword"],
    });

export default function ResetPasswordForm() {
    // Initialize useForm
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const router = useRouter();
    const { email } = useAuth();

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/password/change`,
                {
                    email,
                    newPassword: data.password,
                }
            );

            // Show success alert
            Swal.fire({
                icon: "success",
                title: "Password Reset",
                text:
                    response.data.message ||
                    "Your password has been reset successfully.",
            });

            router.push("/login");
        } catch (error) {
            console.error(
                "Error:",
                error.response ? error.response.data : error.message
            );

            // Show error alert
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.error ||
                    "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full max-w-sm"
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <PasswordInput
                                    className="pl-10 placeholder:text-gray-500 appearance-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <PasswordInput
                                    className="pl-10 placeholder:text-gray-500 appearance-none"
                                    placeholder="Confirm Password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <ul>
                        <li className="flex items-center gap-2 mt-10">
                            <Image
                                src={checkIcon}
                                alt="checkmark"
                                width={16}
                                height={16}
                            />
                            At least 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                            <Image
                                src={checkIcon}
                                alt="checkmark"
                                width={16}
                                height={16}
                            />
                            At least 1 special character
                        </li>
                        <li className="flex items-center gap-2">
                            <Image
                                src={checkIcon}
                                alt="checkmark"
                                width={16}
                                height={16}
                            />
                            At least 1 uppercase letter and 1 lowercase letter
                        </li>
                    </ul>
                </div>

                <div className="py-6">
                    <Button
                        type="submit"
                        className="w-full rounded-3xl py-6 text-lg bg-mint-500 hover:bg-mint-700"
                    >
                        CONFIRM
                    </Button>
                </div>
            </form>
        </Form>
    );
}
