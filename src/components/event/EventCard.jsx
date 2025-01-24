import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaHandPaper, FaImage } from "react-icons/fa";
import "@/app/(home)/home.css";

const EventCard = ({
    id,
    backgroundImage,
    location,
    startDate,
    eventName,
    aboutEvent,
    user,
}) => {
    const [isHandIconActive, setIsHandIconActive] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const showNoImage = !backgroundImage || imageError;

    useEffect(() => {
        if (user) {
            user.eventsAttending.map((event) => event._id).includes(id)
                ? setIsHandIconActive(() => true)
                : setIsHandIconActive(() => false);
        }
    }, []);

    return (
        <div className="event-card-container relative flex flex-wrap w-full h-[219px] md:max-lg:w-[800px] lg:w-[1000px]  mt-10 gap-[61px] md:gap-3 lg:gap-10 hover:cursor-pointer overflow-clip sm:gap-y-10">
            <div className="relative w-full md:w-[300px] h-[219px]">
                {!imageLoaded && !showNoImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[23.53px]">
                        <div className="w-8 h-8 border-4 border-mint-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {showNoImage ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-mint-100 rounded-[23.53px] md:w-[300px] ">
                        <FaImage className="w-12 h-12 text-mint-400 mb-2" />
                        <span className="text-gray-500 text-sm">
                            No Image Available
                        </span>
                    </div>
                ) : (
                    <img
                        src={backgroundImage}
                        alt="Event"
                        className={`event-image w-full md:w-[300px] h-[219px] rounded-[23.53px] object-cover transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => {
                            setImageLoaded(true);
                        }}
                        onError={() => {
                            setImageError(true);
                            setImageLoaded(true);
                        }}
                    />
                )}

                <div
                    className={
                        isHandIconActive
                            ? `hand-icon absolute top-4 right-5 p-2 rounded-full bg-mint-500`
                            : `hand-icon absolute top-4 right-5 p-2 rounded-full bg-mint-500 hidden`
                    }
                >
                    <FaHandPaper className={`text-white bg-mint-500`} />
                </div>
            </div>
            <div className="event-info flex flex-col border border-gray-400 rounded-[20px] md:w-[485px] lg:w-[660px] w-full h-[219px] p-[24px] md:p-3 lg:p-4 shadow-sm">
                <div className="event-details flex items-center gap-2 text-[16px] leading-[18.75px] text-gray-600">
                    <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-600" />
                        {location}
                    </span>
                    <span>•</span>
                    <span>{startDate.slice(0, 10)}</span>
                </div>
                <h3 className="event-title text-[24px] leading-[28.13px] font-semibold text-black mt-[20px]">
                    {eventName}
                </h3>
                <p className="event-description mt-[14px] text-[18px] leading-[21.09px] text-gray-600">
                    {aboutEvent}
                </p>
            </div>
        </div>
    );
};

export default EventCard;
