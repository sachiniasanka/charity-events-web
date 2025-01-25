"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import emailIcon from "@/assets/img/email-icon.png";
import { InputWithIcon } from "@/components/ui/InputWithIcon";
import { Button } from "@/components/ui/Button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/Form";
import { useAuth } from "@/hooks/authContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

// Define the form schema
const formSchema = z.object({
    email: z.string().email(),
});

export default function ForgotPasswordForm() {
    const { setEmail } = useAuth();
    const router = useRouter();

    // Initialize useForm
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    // Handle form submission
    const onSubmit = (values) => {
        try {
            // API call to send reset OTP
            const response = axios.post(
                `${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/password/reset`,
                {
                    email: values.email,
                }
            );

            // Handle success response
            Swal.fire({
                icon: "success",
                title: "OTP Sent!",
                text: "Password reset OTP has been sent to your email.",
            });

            // Save email to context and navigate to verify page
            setEmail(values.email);
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
                className="space-y-14 w-full max-w-sm"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <InputWithIcon
                                    className="pl-10 placeholder:text-gray-500"
                                    type="email"
                                    iconSrc={emailIcon}
                                    alt="email icon"
                                    placeholder="E-mail"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full rounded-3xl py-6 text-lg bg-mint-500 hover:bg-mint-700"
                >
                    SUBMIT
                </Button>
            </form>
        </Form>
    );
}
