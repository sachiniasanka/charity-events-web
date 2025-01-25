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
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/authContext";
import Swal from "sweetalert2";
import axios from "axios";

// Define the form schema
const formSchema = z
    .object({
        square1: z.string().regex(/^[0-9]$/),
        square1: z.string().regex(/^[0-9]$/),
        square2: z.string().regex(/^[0-9]$/),
        square3: z.string().regex(/^[0-9]$/),
        square4: z.string().regex(/^[0-9]$/),
    })
    .required();

export default function VerificationForm() {
    // Initialize useForm
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            square1: "",
            square2: "",
            square3: "",
            square4: "",
        },
    });

    const router = useRouter();
    const { email } = useAuth();

    // Handle form submission
    const onSubmit = async (values) => {
        const otp = `${values.square1}${values.square2}${values.square3}${values.square4}`;

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/password/verify`,
                {
                    email,
                    otp,
                }
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.message || "OTP verified successfully.",
            });

            router.push("/reset-password");
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                "An error occurred. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text: errorMessage,
            });
        }
    };

    const handleResend = async () => {
        try {
            // API call to send reset OTP
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/password/reset`,
                {
                    email, // Use the email from the context
                }
            );

            // Handle success response
            Swal.fire({
                icon: "success",
                title: "OTP Sent!",
                text: "Password reset OTP has been sent to your email.",
            });

            // Optionally navigate to the verify page
            router.push("/verify");
        } catch (error) {
            // Handle error response and display it to the user
            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.error ||
                    "Something went wrong. Please try again later.",
            });
            console.error("Error sending OTP:", error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full max-w-sm"
            >
                <div className="flex gap-2 justify-center mt-6">
                    <FormField
                        control={form.control}
                        name="square1"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="w-14 h-14 text-center"
                                        type="text"
                                        inputMode="numeric"
                                        min="0"
                                        max="9"
                                        maxLength="1"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (
                                                e.target.value.match(/^[0-9]$/)
                                            ) {
                                                const nextInput =
                                                    document.querySelector(
                                                        'input[name="square2"]'
                                                    );
                                                if (nextInput)
                                                    nextInput.focus();
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="square2"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="w-14 h-14 text-center"
                                        type="text"
                                        inputMode="numeric"
                                        min="0"
                                        max="9"
                                        maxLength="1"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (
                                                e.target.value.match(/^[0-9]$/)
                                            ) {
                                                const nextInput =
                                                    document.querySelector(
                                                        'input[name="square3"]'
                                                    );
                                                if (nextInput)
                                                    nextInput.focus();
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="text-3xl items-center">_</div>
                    <FormField
                        control={form.control}
                        name="square3"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="w-14 h-14 text-center"
                                        type="text"
                                        inputMode="numeric"
                                        min="0"
                                        max="9"
                                        maxLength="1"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (
                                                e.target.value.match(/^[0-9]$/)
                                            ) {
                                                const nextInput =
                                                    document.querySelector(
                                                        'input[name="square4"]'
                                                    );
                                                if (nextInput)
                                                    nextInput.focus();
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="square4"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="w-14 h-14 text-center"
                                        type="text"
                                        inputMode="numeric"
                                        min="0"
                                        max="9"
                                        maxLength="1"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (
                                                e.target.value.match(/^[0-9]$/)
                                            ) {
                                                const verifyButton =
                                                    document.querySelector(
                                                        'button[type="submit"]'
                                                    );
                                                if (verifyButton)
                                                    verifyButton.focus();
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Single error message in the middle */}
                <div className="text-center">
                    <FormMessage>
                        {form.formState.errors.square1 ||
                        form.formState.errors.square2 ||
                        form.formState.errors.square3 ||
                        form.formState.errors.square4
                            ? "Please enter a valid verification code"
                            : null}
                    </FormMessage>
                </div>

                <div className="flex flex-col justify-center">
                    <p className="text-center text-lg">
                        Didn't receive the code?
                    </p>
                    <div className="flex items-center justify-center">
                        <a
                            onClick={handleResend}
                            className="text-mint-800 text-lg hover:underline hover:cursor-pointer"
                            variant="link"
                        >
                            Resend
                        </a>
                    </div>
                </div>

                <div className="py-6">
                    <Button
                        type="submit"
                        className="w-full rounded-3xl py-6 text-lg bg-mint-500 hover:bg-mint-700 mt-64 lg:mt-0"
                    >
                        VERIFY NOW
                    </Button>
                </div>
            </form>
        </Form>
    );
}
