import "@/app/globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata = {
    title: "GIVEWELL",
    description: "Be the Change You Wish to See",
};

export default function HomeLayout({ children }) {
    return (
        <>
            <Navbar isUserLoggedIn={true} />
            {children}
            <Footer />
        </>
    );
}
