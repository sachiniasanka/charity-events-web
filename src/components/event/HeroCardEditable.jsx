"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import usersIcon from "@/assets/img/users-icon.png";
import EditIcon from "@/components/icon/EditIcon";
export default function HeroCardEditable({ event }) {
    return (
        <>
            <div className="relative lg:h-[566px] h-64 rounded-lg overflow-hidden mb-8">
                <div className="absolute top-0 left-0 p-4 lg:hidden">
                    <ArrowLeft
                        size={35}
                        className="bg-white rounded-full text-black cursor-pointer p-[6px]"
                        onClick={() => window.history.back()}
                    ></ArrowLeft>
                </div>
                <div className="absolute top-0 right-0 p-4">
                    <div
                        onClick={() =>
                            (window.location.href = `/your-events/${event._id}/edit`)
                        }
                    >
                        <EditIcon
                            size={35}
                            className="bg-white rounded-full text-black cursor-pointer p-[7px]"
                        ></EditIcon>
                    </div>
                </div>
                <img
                    src={event?.backgroundImage || "/placeholder.jpg"}
                    alt="Event Image"
                    className="w-full h-full object-cover "
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="text-white ml-2">
                        <div>
                            <Image
                                className="inline-block lg:w-8 w-6"
                                src={usersIcon || "/placeholder.jpg"}
                                alt="users icon"
                                width={25}
                                height={25}
                            />
                            <span className="ml-2 lg:text-xl">
                                {event?.attendUsers.length}
                            </span>
                        </div>
                        <h1 className="lg:text-4xl text-xl font-bold mb-2">
                            {event?.eventName}
                        </h1>
                        <div className="inline-block px-3 py-1 bg-white text-mint-500 rounded-full text-sm font-bold mb-2">
                            {event?.status == 0
                                ? "Hosting"
                                : event?.status == 1
                                ? "Upcoming"
                                : "Past Event"}
                        </div>
                        {/* <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5" />
                            <span>{event.date}</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}
