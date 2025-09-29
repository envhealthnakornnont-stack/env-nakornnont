import ContactInfo from "./ContactInfo";
import Copyright from "./Copyright";
import SocialMediaLinks from "./SocialMediaLinks";

const Footer = () => {
    return (
        <div>
            <footer className="footer bg-base-200 text-base-content rounded p-8 sm:p-10">
                <ContactInfo />
            </footer>
            <footer className="footer footer-center bg-base-200 text-base-content border-base-300 border-t px-10 py-4 gap-2">
                <SocialMediaLinks />
                <Copyright />
            </footer>
        </div>
    );
};

export default Footer;
