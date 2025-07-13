import {Landing} from "../../components/index/landing/Landing.tsx";
import {UpcomingEvents} from "../../components/index/upcomingEvents/UpcomingEvents.tsx";
import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {Banner} from "../../components/index/banner/Banner.tsx";
import {Brands} from "../../components/index/Brands/Brands.tsx";
import {Blog} from "../../components/index/blog/Blog.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";

export const Index = () => {
    return (
        <>
            <Navbar />
            <Landing />
            <UpcomingEvents />
            <Banner />
            <Brands />
            <Blog />
            <Footer />
        </>
    );
};