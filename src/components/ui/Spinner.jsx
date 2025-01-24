import React, { useEffect } from "react";

const Spinner = () => {
    // Reset scroll position when spinner mounts
    useEffect(() => {
        window.scrollTo(0, 0);
        // Prevent scroll while loading
        document.body.style.overflow = "hidden";

        // Cleanup function to restore scroll when spinner unmounts
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
            <div className="animate-spin rounded-full h-20 w-20 lg:h-32 lg:w-32 border-b-2 border-mint-500"></div>
        </div>
    );
};

export default Spinner;
