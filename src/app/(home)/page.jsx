"use client";
import { useState, useEffect } from "react";
import {
    FaMapMarkerAlt,
    FaCalendarPlus,
    FaHandPaper,
    FaImage,
} from "react-icons/fa";
import "@/app/(home)/home.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import jwt from "jsonwebtoken";
import Spinner from "@/components/ui/Spinner";

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
                ? setIsHandIconActive(true)
                : setIsHandIconActive(false);
        }
    }, []);

    return (
        <div className="event-card-container relative flex flex-wrap md:flex-nowrap w-full md:w-[1223px] h-[219px] mt-10 gap-[61px] hover:cursor-pointer overflow-clip">
            <div className="relative w-full md:w-[390px] h-[219px]">
                {!imageLoaded && !showNoImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[23.53px]">
                        <div className="w-8 h-8 border-4 border-mint-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {showNoImage ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-mint-100 rounded-[23.53px]">
                        <FaImage className="w-12 h-12 text-mint-400 mb-2" />
                        <span className="text-gray-500 text-sm">
                            No Image Available
                        </span>
                    </div>
                ) : (
                    <img
                        src={backgroundImage}
                        alt="Event"
                        className={`event-image w-full md:w-[390px] h-[219px] rounded-[23.53px] object-cover transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => {
                            console.info("Image loaded!");
                            setImageLoaded(true);
                        }}
                        onError={() => {
                            console.error("Image failed to load");
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
            <div className="event-info border border-gray-300 rounded-[20px] p-[24px] shadow-sm w-full md:w-[772px] h-[219px]">
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

const HomePage = () => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("userToken");

                if (token) {
                    setIsLoggedIn(true);
                    const userId = jwt.decode(token).id;
                    try {
                        const userResponse = await axios.get(
                            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/user/${userId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        const userData = userResponse.data;
                        setUser(userData);

                        // Fetch nearby upcoming events if user is logged in
                        const nearbyResponse = await axios.get(
                            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/upcoming-3-by-location/${userData.location}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        setEvents(nearbyResponse.data);
                    } catch (error) {
                        console.warn("User not found:", error);
                        localStorage.removeItem("userToken");
                    }
                } else {
                    setIsLoggedIn(false);
                    // Fetch general upcoming events if not logged in
                    const generalResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/status/1`,
                        {
                            params: {
                                limit: 3,
                            },
                        }
                    );
                    setEvents(generalResponse.data);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setIsLoggedIn(false);
                    return;
                }
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            {isLoading && <Spinner />}
            {!isLoading && (
                <div className="home-page-container overflow-x-hidden">
                    <div className="hero-section w-full max-w-full h-[1001px]">
                        <div
                            className="hero-bg bg-cover"
                            style={{
                                backgroundImage: "url(/images/GridHero.png)",
                            }}
                        >
                            <div className="hero-text-container flex justify-center">
                                <div className="hero-heading p-5 font-roboto font-bold text-[56px] leading-[72px] text-center mt-24 text-black h-36 w-full max-w-4xl">
                                    <h1>
                                        Be the Change You Wish to See Volunteer
                                        Today!
                                    </h1>
                                </div>
                            </div>
                            <div className="hero-subheading p-0 font-roboto font-normal text-xl leading-7 text-center mt-10 text-gray-600">
                                <h2 className="first-h2">
                                    Discover impactful events near you, connect
                                    with your
                                </h2>
                                <h2 className="second-h2">
                                    community, and make a difference where it
                                    matters most.
                                </h2>
                            </div>
                        </div>
                        <button
                            className="host-event-btn bg-greenbutton text-white font-roboto font-medium text-lg leading-9 text-center py-4 px-8 mx-auto block border-none rounded-full mt-6 w-[222px] h-[70px]"
                            onClick={
                                isLoggedIn
                                    ? () => router.push("/host-events")
                                    : () => router.push("/login")
                            }
                        >
                            Host your event
                        </button>
                        <div className="image-gallery flex justify-center items-end mt-5 gap-6 w-full max-w-5xl h-132 mx-auto">
                            <img
                                src="/images/Frame 11.png"
                                alt="Image 1"
                                className="gallery-image w-72 h-132 rounded-lg"
                            />
                            <img
                                src="/images/Frame 12.jpg"
                                alt="Image 2"
                                className="gallery-image w-72 h-112 rounded-lg"
                            />
                            <img
                                src="/images/Frame 13.png"
                                alt="Image 3"
                                className="gallery-image w-72 h-112 rounded-lg"
                            />
                            <img
                                src="/images/Frame 14.png"
                                alt="Image 4"
                                className="gallery-image w-72 h-132 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="events-section w-full max-w-full flex justify-center items-center mx-auto">
                        <div>
                            <div>
                                <h3 className="location-title text-lg leading-6 font-roboto text-gray-600 flex items-center w-40 h-5 mt-24 mr-auto">
                                    <FaMapMarkerAlt className="text-gray-600 mr-2" />
                                    {isLoggedIn ? user?.location : "Global"}
                                </h3>
                                <div className="events-header w-full max-w-full h-[723px] mt-0 ">
                                    <h2 className="events-heading font-roboto font-bold text-[40px] leading-[72px] text-black mx-auto">
                                        Upcoming Events{" "}
                                        {isLoggedIn ? "in your area" : ""}
                                    </h2>
                                </div>
                            </div>
                            <div className="explore-button-container w-44 h-14 mt-[-725px]">
                                <button
                                    className="explore-events-btn bg-greenbutton text-white font-roboto font-medium text-[16px] leading-[32px] text-center py-1.5 px-4 border-none rounded-[50px] w-[174px] h-[54px] ml-[1048px]"
                                    onClick={
                                        isLoggedIn
                                            ? () => router.push("/events")
                                            : () => router.push("/login")
                                    }
                                >
                                    Explore Events
                                </button>
                            </div>
                            {events.map((event, index) => (
                                <div
                                    key={index}
                                    onClick={
                                        isLoggedIn
                                            ? () =>
                                                  router.push(
                                                      `/events/${event._id}`
                                                  )
                                            : () => router.push("/login")
                                    }
                                >
                                    <EventCard
                                        id={event._id}
                                        {...event}
                                        user={user}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="whatwedo-section w-full max-w-full mt-[108px]">
                        <div className="whatwedo-header text-center md:mt-[10px] md:gap-[24px] font-roboto md:w-full md:align-center mx-auto">
                            <h2 className="whatwedo-title text-gray-500 text-[18px] leading-[21.09px] font-bold">
                                What we do
                            </h2>
                            <h1 className="whatwedo-main-title text-[40px] leading-[46.88px] font-bold mt-2">
                                Connect, Contribute, and Create Change Together
                            </h1>
                            <p className="whatwedo-description text-gray-600 mt-4 font-[400] text-[24px] leading-[28.13px]">
                                We help you host impactful volunteer events and
                                find opportunities to contribute to meaningful
                                causes in your community.
                            </p>
                        </div>

                        <div className="whatwedo-grid-container flex justify-center items-center mt-8">
                            <div className="whatwedo-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="whatwedo-card bg-green-100 p-8 rounded-[20px] text-center w-[288px] h-[276px]">
                                    <div className="whatwedo-icon-container w-[24px] h-[24px] mx-auto mt-[20px] text-green-500">
                                        <FaCalendarPlus className="whatwedo-icon w-[24px] h-[24px]" />
                                    </div>
                                    <h3 className="whatwedo-card-title font-bold text-[20px] leading-[23.44px] mb-2 mt-1">
                                        Host Volunteer Events
                                    </h3>
                                    <p className="whatwedo-card-description text-gray-600 text-[16px] font-[400] leading-[18.75px] w-[240px] mx-auto">
                                        Whether you're passionate about the
                                        environment, animal welfare, or social
                                        causes, our platform makes it simple for
                                        you to create and host volunteer events.
                                        Engage your community, raise awareness,
                                        and drive change.
                                    </p>
                                </div>

                                <div className="whatwedo-card bg-green-100 p-8 rounded-[20px] text-center w-[288px] h-[276px]">
                                    <div className="whatwedo-icon-container w-[24px] h-[24px] mx-auto mt-[20px] text-green-500">
                                        <FaCalendarPlus className="whatwedo-icon w-[24px] h-[24px]" />
                                    </div>
                                    <h3 className="whatwedo-card-title font-bold text-lg mb-2">
                                        Join Events Near You
                                    </h3>
                                    <p className="whatwedo-card-description text-gray-600 text-[16px] font-[400] leading-[18.75px] w-[240px] mx-auto">
                                        Looking for ways to give back? Browse
                                        local volunteer opportunities and join
                                        events that match your interests. Every
                                        action counts in building a better
                                        community.
                                    </p>
                                </div>

                                <div className="whatwedo-card bg-green-100 p-8 rounded-[20px] text-center w-[288px] h-[276px]">
                                    <div className="whatwedo-icon-container w-[24px] h-[24px] mx-auto mt-[20px] text-green-500">
                                        <FaCalendarPlus className="whatwedo-icon w-[24px] h-[24px]" />
                                    </div>
                                    <h3 className="whatwedo-card-title font-bold text-lg mb-2">
                                        Impactful Connections
                                    </h3>
                                    <p className="whatwedo-card-description text-gray-600 text-[16px] font-[400] leading-[18.75px] w-[240px] mx-auto">
                                        Volunteerism connects people. By hosting
                                        or joining events, you meet like-minded
                                        individuals who share your vision for a
                                        better world.
                                    </p>
                                </div>

                                <div className="whatwedo-card bg-green-100 p-8 rounded-[20px] text-center w-[288px] h-[276px]">
                                    <div className="whatwedo-icon-container w-[24px] h-[24px] mx-auto mt-[20px] text-green-500">
                                        <FaCalendarPlus className="whatwedo-icon w-[24px] h-[24px]" />
                                    </div>
                                    <h3 className="whatwedo-card-title font-bold text-lg mb-2">
                                        Track Your Contributions
                                    </h3>
                                    <p className="whatwedo-card-description text-gray-600 text-[16px] font-[400] leading-[18.75px] w-[240px] mx-auto">
                                        See the difference you’re making! Our
                                        platform allows you to track the events
                                        you've hosted or participated in and
                                        share your experiences with others.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="whatwedo-button-container text-center mt-8 w-[222px] h-[70px] mx-auto">
                            <button
                                className="whatwedo-button w-[222px] h-[70px] bg-greenbutton text-white font-roboto font-medium text-[22px] leading-[38px] text-center py-4 px-8 rounded-[50px]"
                                onClick={
                                    isLoggedIn
                                        ? () => router.push("/host-events")
                                        : () => router.push("/login")
                                }
                            >
                                <span>Host Your Event</span>
                            </button>
                        </div>
                    </div>

                    <section className="contact-section w-full max-w-full h-[711px] mt-[108px]">
                        <div className="contact-header text-center lg:text-left w-full lg:w-[1016px] mx-auto mt-[42px] gap-[24px] flex flex-col lg:flex-row lg:items-center">
                            <div className="contact-image mt-8 lg:mt-0 lg:w-[50%] flex justify-center lg:justify-start">
                                <img
                                    src="/images/Frame 77.png"
                                    alt="contact"
                                    className="gallery-image w-[496px] h-[547px] rounded-lg"
                                />
                            </div>
                            <div className="contact-text w-full lg:w-[50%]">
                                <h2 className="contact-title text-gray-500 text-[18px] leading-[21.09px] font-bold">
                                    Contact Us
                                </h2>
                                <h1 className="contact-main-title text-[40px] leading-[46.88px] font-bold mt-2">
                                    Get in Touch
                                </h1>
                                <p className="contact-description text-gray-600 mt-2 font-[400] text-[24px] leading-[28.13px]">
                                    We’re here to help! Have a question or
                                    feedback? Reach out to us anytime
                                </p>
                                <h1 className="contact-send-title text-[30px] leading-[46.88px] font-bold mt-6">
                                    Send us Your Message!
                                </h1>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="email-input text-[18px] p-[12px] w-full lg:w-[620px] mt-4 border border-gray-300 rounded-md"
                                />
                                <textarea
                                    placeholder="Your Message"
                                    className="message-input text-[18px] p-[12px] w-full lg:w-[620px] mt-4 border border-gray-300 rounded-md h-[150px] resize-y"
                                ></textarea>
                                <div>
                                    <button
                                        className="send-message-btn bg-greenbutton text-white font-roboto font-medium text-[16px] leading-[32px] text-center py-1.5 px-4 border-none rounded-[50px] w-full lg:w-[174px] h-[54px] mt-4"
                                        onClick={() => {
                                            console.log("send message"); //change this to send message
                                        }}
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
};

export default HomePage;
