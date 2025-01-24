import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { IoHandLeft } from "react-icons/io5";
import { useState } from "react";

export default function UserEventCard({
    isGoing,
    toggleGoing,
    id,
    title,
    location,
    date,
    time,
    imageSrc,
    description,
    status,
    isImageLoading,
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const showNoImage = !imageSrc || imageError;

    const handleOnClick = (id) => {
        toggleGoing(id);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const ImageComponent = ({ className }) => {
        if (isImageLoading) {
            return (
                <div
                    className={`animate-pulse bg-gray-200 rounded-3xl ${className}`}
                />
            );
        }

        if (!imageSrc || imageError) {
            return (
                <div
                    className={`bg-gray-100 rounded-3xl flex items-center justify-center ${className}`}
                >
                    <p className="text-gray-400">No image available</p>
                </div>
            );
        }

        return (
            <Image
                src={imageSrc}
                alt="Event Image"
                width={410}
                height={265}
                layout="fixed"
                className={className}
                onError={handleImageError}
                priority={true}
            />
        );
    };

    return (
        <>
            <div className="flex flex-col lg:hidden border-2 border-slate-200 rounded-2xl p-4 mb-8">
                <p className="text-sm sm:text-xl font-bold">{title}</p>
                <div className="flex flex-col sm:flex-row">
                    <div className="flex">
                        <MapPin />
                        <p className="ml-2 text-sm sm:text-lg">{location}</p>
                    </div>
                    <div className="flex">
                        <CalendarDays className="sm:ml-16" />
                        <p className="ml-2 text-sm sm:text-lg">{date}</p>
                    </div>
                </div>
                <div className="py-4">
                    <div className="relative">
                        <ImageComponent className="w-full rounded-3xl" />
                        <div className="absolute top-4 right-4">
                            <Button
                                onClick={() => handleOnClick(id)}
                                className={
                                    isGoing
                                        ? "rounded-full py-6 text-lg hover:text-white bg-mint-500 hover:bg-red-500 border-mint-500 border-2 hover:border-white"
                                        : "rounded-full py-6 text-lg text-mint-500 hover:bg-mint-500 bg-white border-white border-2 hover:text-white hover:border-mint-500"
                                }
                            >
                                <IoHandLeft
                                    style={{ width: "20px", height: "20px" }}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="text-sm sm:text-lg">{description}</p>
            </div>

            {/* for large screens */}
            <div className="lg:flex hidden mb-8">
                <div className="relative min-w-[500px]">
                    <ImageComponent className="w-full rounded-3xl max-h-[500px] object-cover" />
                    <div className="absolute top-4 right-4">
                        <Button
                            onClick={() => handleOnClick(id)}
                            className={
                                isGoing
                                    ? "rounded-full py-6 text-lg hover:text-white bg-mint-500 hover:bg-red-500 border-mint-500 border-2 hover:border-white"
                                    : "rounded-full py-6 text-lg text-mint-500 hover:bg-mint-500 bg-white border-white border-2 hover:text-white hover:border-mint-500"
                            }
                        >
                            <IoHandLeft
                                style={{ width: "20px", height: "20px" }}
                            />
                        </Button>
                    </div>
                </div>
                <div className="block ml-8 p-4 border-2 border-slate-200 rounded-2xl">
                    <div className="flex">
                        <MapPin />
                        <p className="ml-2">{location}</p>
                        <CalendarDays className="ml-16" />
                        <p className="ml-2">{date}</p>
                    </div>
                    <p className="px-2 text-xl font-bold my-3">{title}</p>
                    <p className="px-2">{description}</p>
                </div>
            </div>
        </>
    );
}
