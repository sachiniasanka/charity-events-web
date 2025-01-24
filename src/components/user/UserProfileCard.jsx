"use client";
import GearIcon from "@/components/icon/GearIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function ProfileCard({ user }) {
    const router = useRouter();

    const {
        _id,
        fullName,
        email,
        profileImage,
        eventsAttended,
        eventsCreated,
        eventsAttending,
    } = user;

    return (
        <div className="flex flex-col">
            <div
                className="self-end py-3 px-4"
                onClick={() => router.push(`/profile/${_id}/settings`)}
            >
                <GearIcon className="self-end hover:cursor-pointer hover:stroke-mint-500" />
            </div>
            <Image
                src={profileImage}
                alt={fullName}
                width={100}
                height={100}
                className="rounded-full flex self-center"
            />
            <p className="text-center font-bold text-2xl pt-2">{fullName}</p>
            <p className="text-center text-md">{email}</p>
        </div>
    );
}
