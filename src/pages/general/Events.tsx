import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {Featured} from "../../components/events/featured/Featured.tsx";
import {CategorizedEvents} from "../../components/events/categorizedEvents/CategorizedEvents.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";

export const Events = () => {
    return (
        <>
            <Navbar />
            <Featured />
            <CategorizedEvents />
            <Footer />
        </>
    );
};