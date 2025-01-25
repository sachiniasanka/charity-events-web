"use client";
import HeroCardEditable from "@/components/event/HeroCardEditable";
import EventTabsEditable from "@/components/event/EventTabsEditable";
import HostCard from "@/components/event/HostCard";
import ShareBar from "@/components/event/ShareBar";
import { CommentWithIcon } from "@/components/ui/AddComment";
import CommentCard from "@/components/ui/CommentCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Spinner from "@/components/ui/Spinner";

export default function HostedEventPage({ params }) {
    const id = useParams().id;
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true); // For initial page load
    const [dataLoading, setDataLoading] = useState(false); // For subsequent data refreshes
    const [refreshKey, setRefreshKey] = useState(0);
    const [eventData, setEventData] = useState(null);
    const [eventHost, setEventHost] = useState(null);

    // First useEffect for user authentication and initial validation
    useEffect(() => {
        const validateUser = async () => {
            setInitialLoading(true);
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    router.push("/");
                    return;
                }

                // Validate token format
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
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setUser(response.data);
                setInitialLoading(false); // Only set to false after successful validation
            } catch (err) {
                console.error("Error:", err);
                router.push("/");
            }
        };

        validateUser();
    }, []);

    // Second useEffect for event data and comments
    useEffect(() => {
        const fetchEventData = async () => {
            if (!user) return; // Don't fetch if user isn't validated

            setDataLoading(true);
            const token = localStorage.getItem("userToken");

            try {
                const tokenUserId = jwt.decode(token).id;
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                // Verify user is the event owner
                if (tokenUserId !== response.data.userId) {
                    router.push("/");
                    return;
                }

                setEventData(response.data);

                const hostResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${response.data.userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setEventHost(hostResponse.data);
            } catch (error) {
                console.error("Error:", error);
                router.push("/");
            } finally {
                setDataLoading(false);
            }
        };

        fetchEventData();
    }, [user, refreshKey]);

    // Show spinner only during initial load
    if (initialLoading) {
        return <Spinner />;
    }

    // Don't render anything if user validation failed
    if (!user) {
        return null;
    }

    return (
        <>
            <section>
                <HeroCardEditable event={eventData} />
            </section>

            <main>
                <EventTabsEditable event={eventData} />
            </main>

            <section>
                <HostCard host={eventHost} />
            </section>

            <section>
                <ShareBar setRefreshKey={setRefreshKey} event={eventData} />
            </section>

            <div className="px-9 mt-9">
                <CommentWithIcon eventId={id} setRefreshKey={setRefreshKey} />
            </div>

            <section className="px-9 mt-5">
                {dataLoading ? (
                    <div className="flex justify-center py-4">
                        <Spinner size="small" />{" "}
                    </div>
                ) : (
                    <>
                        <div className="flex">
                            <p className="font-semibold">Comments</p>
                            <p className="ml-5 bg-mint-500 px-2 text-white rounded-full">
                                {eventData?.comments?.length || 0}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            {eventData?.comments?.map((comment, index) => (
                                <CommentCard key={index} comment={comment} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </>
    );
}
