"use client";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import EventCard from "@/components/event/EventCard";

export default function YourEventsTab({ user }) {
    const [isLoading, setIsLoading] = useState(true);
    // const [imageLoadingStates, setImageLoadingStates] = useState({});
    // const [eventStates, setEventStates] = useState({});
    const [allEvents, setAllEvents] = useState({
        eventsCreated: [],
        eventsAttending: [],
        eventsAttended: [],
    });

    const router = useRouter();

    const resizeImage = (url, width, height) => {
        return new Promise((resolve, reject) => {
            // Skip processing if URL is empty or invalid
            if (!url) {
                resolve(null);
                return;
            }

            const img = new Image();
            img.crossOrigin = "Anonymous";

            img.onerror = () => {
                resolve(null); // Return null on error
            };

            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg"));
                } catch (error) {
                    console.error("Error resizing image:", error);
                    resolve(url); // Fall back to original URL on error
                }
            };

            img.src = url;
        });
    };

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            // Initialize with original data first
            setAllEvents({
                eventsCreated: user.eventsCreated || [],
                eventsAttending: user.eventsAttending || [],
                eventsAttended: user.eventsAttended || [],
            });

            const resizeEventImages = async (events) => {
                return Promise.all(
                    events.map(async (event) => {
                        // Set loading state for this event's image
                        // setImageLoadingStates((prev) => ({
                        //     ...prev,
                        //     [event._id]: true,
                        // }));

                        const resizedImage = event.backgroundImage
                            ? await resizeImage(event.backgroundImage, 410, 265)
                            : null;

                        // Update loading state
                        // setImageLoadingStates((prev) => ({
                        //     ...prev,
                        //     [event._id]: false,
                        // }));

                        return {
                            ...event,
                            backgroundImage:
                                resizedImage || event.backgroundImage, // Fall back to original if resize fails
                        };
                    })
                );
            };

            const categorizeAndResizeEvents = async () => {
                try {
                    const categorizedEvents = {
                        eventsCreated: await resizeEventImages(
                            user.eventsCreated || []
                        ),
                        eventsAttending: await resizeEventImages(
                            user.eventsAttending || []
                        ),
                        eventsAttended: await resizeEventImages(
                            user.eventsAttended || []
                        ),
                    };
                    setAllEvents(categorizedEvents);
                } catch (error) {
                    console.error("Error processing events:", error);
                    // Fall back to original data on error
                    setAllEvents({
                        eventsCreated: user.eventsCreated || [],
                        eventsAttending: user.eventsAttending || [],
                        eventsAttended: user.eventsAttended || [],
                    });
                }
                setIsLoading(false);
            };

            categorizeAndResizeEvents();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const toggleGoing = (id) => {
        setEventStates((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    // Pass loading state to UserEventCard
    const renderEventCard = (event, pathPrefix = "/events") => (
        <div
            key={event._id}
            className="hover:cursor-pointer"
            onClick={() => router.push(`${pathPrefix}/${event._id}`)}
        >
            {/* <UserEventCard
                isGoing={eventStates[event._id]}
                toggleGoing={toggleGoing}
                id={event._id}
                title={event.eventName}
                date={new Date(event.startDate).toLocaleDateString()}
                location={event.location}
                imageSrc={event.backgroundImage}
                description={event.aboutEvent}
                isImageLoading={imageLoadingStates[event._id]}
            /> */}
            <EventCard
                id={event._id}
                eventName={event.eventName}
                startDate={new Date(event.startDate).toLocaleDateString()}
                location={event.location}
                backgroundImage={event.backgroundImage}
                aboutEvent={event.aboutEvent}
                user={user}
            />
        </div>
    );

    return (
        <>
            {isLoading && <Spinner />}
            {!isLoading && (
                <div className="flex justify-center px-4">
                    <Tabs.Root
                        className="flex w-full flex-col"
                        defaultValue="tab1"
                    >
                        <Tabs.List
                            className="flex shrink-0"
                            aria-label="Event Details and Media"
                        >
                            <Tabs.Trigger
                                className="flex h-[45px] flex-1 cursor-pointer select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-[3px] data-[state=active]:border-mint-500"
                                value="tab1"
                            >
                                Hosting
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                className="flex h-[45px] flex-1 cursor-pointer select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-[3px] data-[state=active]:border-mint-500"
                                value="tab2"
                            >
                                Upcoming Events
                            </Tabs.Trigger>
                            <Tabs.Trigger
                                className="flex h-[45px] flex-1 cursor-pointer select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-[3px] data-[state=active]:border-mint-500"
                                value="tab3"
                            >
                                Past Events
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content
                            className="grow mx-auto rounded-b-md bg-white p-0 outline-none focus:shadow-[0_0_0_2px] focus:shadow-mint-500"
                            value="tab1"
                        >
                            <div>
                                {allEvents.eventsCreated.length === 0 ? (
                                    <p>No events created</p>
                                ) : (
                                    allEvents.eventsCreated.map((event) =>
                                        renderEventCard(event, "/your-events")
                                    )
                                )}
                            </div>
                        </Tabs.Content>

                        <Tabs.Content
                            className="grow mx-auto rounded-b-md bg-white p-0 outline-none focus:shadow-[0_0_0_2px] focus:shadow-mint-500"
                            value="tab2"
                        >
                            <div>
                                {allEvents.eventsAttending.length === 0 ? (
                                    <p>No upcoming events</p>
                                ) : (
                                    allEvents.eventsAttending.map((event) =>
                                        renderEventCard(event)
                                    )
                                )}
                            </div>
                        </Tabs.Content>

                        <Tabs.Content
                            className="grow mx-auto rounded-b-md bg-white p-0 outline-none focus:shadow-[0_0_0_2px] focus:shadow-mint-500"
                            value="tab3"
                        >
                            <div>
                                {allEvents.eventsAttended.length === 0 ? (
                                    <p>No past events</p>
                                ) : (
                                    allEvents.eventsAttended.map((event) =>
                                        renderEventCard(event)
                                    )
                                )}
                            </div>
                        </Tabs.Content>
                    </Tabs.Root>
                </div>
            )}
        </>
    );
}
