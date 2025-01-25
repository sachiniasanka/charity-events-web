"use client";
import HeroCard from "@/components/event/HeroCard";
import EventTabs from "@/components/event/EventTabs";
import HostCard from "@/components/event/HostCard";
import ShareBar from "@/components/event/ShareBar";
import { CommentWithIcon } from "@/components/ui/AddComment";
import CommentCard from "@/components/ui/CommentCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import jwt from "jsonwebtoken";

export default function EventPage() {
    const id = useParams().id;
    const router = useRouter();
    const [user, setUser] = useState(null);

    const [refreshKey, setRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [eventData, setEventData] = useState(null);
    const [eventHost, setEventHost] = useState({
        id,
        userId: "1",
        eventName: `Support Animal Welfare`,
        location: "Kandy",
        startDate: "21 December 2024",
        status: "Upcoming",
        attendUsers: ["2", "3", "4"],
        aboutEvent:
            "Join us for a meaningful day at the local animal shelter...",
        comments: [
            {
                userId: "2",
                comment: "Such an amazing event!",
                createdAt: "22 December 2024",
            },
            {
                userId: "3",
                comment: "This event is a perfect opportunity",
                createdAt: "22 December 2024",
            },
            {
                userId: "4",
                comment: "I'm so grateful for events like thi",
                createdAt: "22 December 2024",
            },
        ],
    });

    //retrieve event details here with api call from the backend with event_id
    //this is a sample event details from the design

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("userToken");

                if (!token) {
                    setIsLoading(false);
                    router.push("/");
                    return;
                }

                if (token) {
                    const userId = jwt.decode(token).id;
                    const userResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const userData = userResponse.data;
                    if (userResponse.status === 200) {
                        setUser(userData);
                    } else {
                        router.push("/");
                        return;
                    }
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                        },
                    }
                );
                setEventData(response.data);

                const hostResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${response.data.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "userToken"
                            )}`,
                        },
                    }
                );
                setEventHost(hostResponse.data);
            } catch (error) {
                router.push("/");
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [refreshKey]);

    if (!user) {
        return <Spinner />;
    }

    return !isLoading ? (
        <>
            <section>
                {/* hero section */}
                <HeroCard event={eventData}></HeroCard>
            </section>

            <main>
                {/* main content */}
                <EventTabs event={eventData}></EventTabs>
            </main>

            <section>
                {/* host details section */}
                <HostCard host={eventHost}></HostCard>
            </section>

            <section>
                {/* share bar section */}
                <ShareBar
                    setRefreshKey={setRefreshKey}
                    event={eventData}
                ></ShareBar>
            </section>

            <div className="px-9 mt-9">
                {/* add a comment */}
                <CommentWithIcon eventId={id} setRefreshKey={setRefreshKey} />
            </div>

            <section className="px-9 mt-5">
                {/* comment section */}
                <div className="flex">
                    <p className="font-semibold">Comments</p>
                    <p className="ml-5 bg-mint-500 px-2 text-white rounded-full">
                        {eventData?.comments && eventData.comments?.length}
                    </p>
                </div>
                <div className="flex flex-col">
                    {eventData?.comments &&
                        eventData.comments?.map((comment, index) => (
                            <CommentCard
                                key={index}
                                comment={comment}
                            ></CommentCard>
                        ))}
                </div>
            </section>
        </>
    ) : (
        <Spinner />
    );
}
