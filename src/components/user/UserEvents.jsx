"use client";
import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import AllEventsIcon from "@/components/icon/AllEventsIcon";
import { IoHandLeft } from "react-icons/io5";
import EventCard from "@/components/event/EventCard";
import { useRouter } from "next/navigation";

export default function UserEvents({ user }) {
    const [eventStates, setEventStates] = useState({
        1: false,
        2: false,
        3: false,
    });

    const router = useRouter();

    const allEvents = Array.from(
        new Set([
            ...user.eventsAttended,
            ...user.eventsCreated,
            ...user.eventsAttending,
        ])
    );

    const toggleGoing = (id) => {
        setEventStates((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div className="flex justify-center px-4">
            <Tabs.Root className="flex w-full flex-col" defaultValue="tab1">
                <Tabs.List
                    className="flex shrink-0"
                    aria-label="Event Details and Media"
                >
                    <Tabs.Trigger
                        className="flex h-[45px] flex-1 cursor-pointer select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-[3px] data-[state=active]:border-mint-500"
                        value="tab1"
                    >
                        <AllEventsIcon />
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className="flex h-[45px] flex-1 cursor-pointer select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:border-b-[3px] data-[state=active]:border-mint-500"
                        value="tab2"
                    >
                        <IoHandLeft style={{ width: "20px", height: "20px" }} />
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                    className="grow rounded-b-md bg-white p-5 outline-none "
                    value="tab1"
                >
                    <div className="flex flex-col mb-5 items-center">
                        {allEvents.map((event, index) => {
                            return (
                                <div
                                    key={`event-${index}`}
                                    className="hover:cursor-pointer"
                                    onClick={() =>
                                        router.push(`/events/${event._id}`)
                                    }
                                >
                                    <EventCard
                                        id={event._id}
                                        eventName={event.eventName}
                                        startDate={event.startDate}
                                        location={event.location}
                                        aboutEvent={event.aboutEvent}
                                        backgroundImage={event.backgroundImage}
                                        user={user}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Tabs.Content>
                <Tabs.Content
                    className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-mint-500"
                    value="tab2"
                >
                    <div className="flex flex-col mb-5 items-center">
                        {/* Add going events */}
                        {user.eventsAttending.length === 0 ? (
                            <p>No upcoming events found</p>
                        ) : (
                            user.eventsAttending.map((event, index) => {
                                //pull from backend db and fill the events
                                return (
                                    <div
                                        key={`attending-${index}`}
                                        className="hover:cursor-pointer"
                                        onClick={() =>
                                            router.push(`/events/${event._id}`)
                                        }
                                    >
                                        <EventCard
                                            id={event._id}
                                            eventName={event.eventName}
                                            startDate={event.startDate}
                                            location={event.location}
                                            aboutEvent={event.aboutEvent}
                                            backgroundImage={
                                                event.backgroundImage
                                            }
                                            user={user}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
