"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import YourEventsCard from "@/components/event/YourEventsCard";
import YourEventsTabs from "@/components/event/YourEventsTabs";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";

export default function YourEvents() {
    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Get user token from localStorage
                const token = localStorage.getItem("userToken");
                if (!token) {
                    router.push("/");
                    return;
                }

                // Decode token to get user ID
                let userId;
                try {
                    userId = JSON.parse(atob(token.split(".")[1])).id;
                } catch (err) {
                    router.push("/");
                    return;
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(response.data);
            } catch (err) {
                setError(err.message || "Failed to fetch user data");
                router.push("/");
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (initialLoading) {
        return <Spinner />;
    }

    // Return null during initial loading or if validation failed
    if (initialLoading || !user) {
        return null;
    }

    return (
        <>
            <section>
                <YourEventsCard user={user} />
            </section>
            <section>
                <YourEventsTabs user={user} />
            </section>
        </>
    );
}
