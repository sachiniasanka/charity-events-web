"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import EventCard from "@/components/event/EventCard";
import Pagination from "@mui/material/Pagination";
import "@mui/material/Pagination";
import "@/app/(events)/events/all-events.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import jwt from "jsonwebtoken";
import Spinner from "@/components/ui/Spinner";

const event_p_p = 6;

const page = () => {
    const router = useRouter();

    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("userToken");

                if (!token) {
                    setIsLoggedIn(false);
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
                        setIsLoggedIn(true);
                        setUser(userData);
                    } else {
                        router.push("/");
                        return;
                    }

                    // Fetch all nearby upcoming events
                    const nearbyResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/events/upcoming-all-by-location/${userData.location}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setEvents(nearbyResponse.data);
                }
            } catch (error) {
                router.push("/");
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    //filter search
    const filteredEvents = events.filter((event) =>
        event.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    //pagination
    const totalPages = Math.ceil(filteredEvents.length / event_p_p);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };
    const displayedEvents = filteredEvents.slice(
        (currentPage - 1) * event_p_p,
        currentPage * event_p_p
    );

    if (!user) {
        return <Spinner />;
    }

    return (
        <>
            {isLoading && <Spinner />}
            {!isLoading && (
                <div>
                    <div
                        className="All-events-hero-container width-[1440px] h-[322px] bg-cover flex flex-col items-center gap-0"
                        style={{ backgroundImage: "url(/images/GridHero.png)" }}
                    >
                        <div className="All-events-hero-title flex-col items-center justify-center h-[72px] font-roboto text-black text-[56px] leading-[72px] font-bold mt-[100px]">
                            <h1>All Events</h1>
                        </div>
                        <div className="All-events-hero-subtitle flex flex-col items-center font-roboto text-subtitlecolor text-[28px] leading-[38px] font-normal">
                            <h2>
                                Discover Volunteer Opportunities in Your Area
                            </h2>
                        </div>
                    </div>

                    <div className="All-events-container w-full mt-[20px] flex flex-col p-[16px] relative justify-center items-center">
                        <div className="All-events-search mt-[60px] ml-[120px] md:ml-10 lg:ml-32 xl:ml-44 2xl:ml-[500px] mx-auto w-[499px] lg:w-[600px] h-[45px] flex items-center p-[12px 16px] border-[1px] border-solid border-subtitlecolor rounded-[50px] transition-all duration-300 hover:shadow-lg focus-within:shadow-xl">
                            <input
                                type="text"
                                className="search-input w-full h-full pl-5 pr-10 rounded-[25px] bg-white text-lg text-gray-700 placeholder-gray-400 focus:outline-none"
                                placeholder="Search for events"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <FaSearch className="mr-[20px] text-subtitlecolor" />
                        </div>

                        <div className="All-events-location-container flex justify-end w-full">
                            <h3 className="location-title text-[20px] leading-[23.44px] mt-[-40px] mr-[120px] md:mr-[50px] lg:mr-[100px] xl:mr-[150px] 2xl:mr-[500px] font-roboto text-gray-600 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-gray-600" />
                                {user && user.location}
                            </h3>
                        </div>
                        <div className="All-events-cards-container flex flex-wrap justify-center items-start mt-[80px] gap-6">
                            {displayedEvents.length > 0 ? (
                                displayedEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            router.push(`/events/${event._id}`)
                                        }
                                        className="hover:cursor-pointer"
                                    >
                                        <EventCard
                                            id={event._id}
                                            {...event}
                                            user={user}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="no-results-message text-center text-gray-500 text-lg">
                                    No results found for your search.
                                </div>
                            )}
                        </div>

                        <div className="All-events-pagination-controls flex justify-center mt-[20px] sm:mb-[200px] lg:mt-[100px]">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                variant="outlined"
                                sx={{
                                    ".MuiPaginationItem-root": {
                                        color: "#00B894",
                                        borderColor: "#00B894",
                                        fontSize: "12px",
                                    },
                                    ".MuiPaginationItem-root.Mui-selected": {
                                        backgroundColor: "#00B894",
                                        color: "#fff",
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default page;
