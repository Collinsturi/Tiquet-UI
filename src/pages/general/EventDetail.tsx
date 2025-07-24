import {EventImages} from "../../components/eventDetail/EventImages/EventImages.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";
import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {EventDescription} from "../../components/eventDetail/eventDescription/EventDescription.tsx";
import {EventMetaData} from "../../components/eventDetail/eventMetaData/EventMetaData.tsx";
import {EventGuidelines} from "../../components/eventDetail/eventGuidelines/EventGuidelines.tsx";
import {
    EventFrequentlyAskedQuestions
} from "../../components/eventDetail/eventFrequentlyAskedQuestions/EventFrequentlyAskedQuestions.tsx";
import {EventTicketDetails} from "../../components/eventDetail/eventTicketDetails/EventTicketDetails.tsx";

export const EventDetail = () => {
    return (
        <>
            <Nav                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    bar />
            <EventImages />
            <EventDescription />
            <EventMetaData />
            <EventGuidelines />
            <EventTicketDetails />
            <EventFrequentlyAskedQuestions />
            <Footer />
        </>
    );
};