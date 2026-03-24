import {
    DigitalExperienceIcon,
    EndToEndIcon,
    PersonalizedServiceIcon2,
    RenterScreeningIcon,
    VerifiedListingIcon,
} from "@/assets/icons";

const perks: { icon: React.ReactNode; text: string }[] = [
    {
        icon: <DigitalExperienceIcon className="w-6 h-6" />,
        text: "Best in Class Digital Experience ",
    },
    {
        icon: <EndToEndIcon className="w-6 h-6" />,
        text: "End-to-End Solution ",
    },
    {
        icon: <RenterScreeningIcon className="w-6 h-6" />,
        text: "Renter Screening ",
    },
    {
        icon: <PersonalizedServiceIcon2 className="w-6 h-6" />,
        text: "Personalized Service ",
    },
    {
        icon: <VerifiedListingIcon className="w-6 h-6" />,
        text: "Verified Listings ",
    },
];

const Header = () => {
    return (
        <div className="bg-white w-full text-center text-secondary">
            <div className="container px-5 py-10 lg:py-0 mx-auto flex flex-col items-center lg:h-[40vh]">
                <p className="lg:text-6xl text-5xl font-light lg:mt-24 mt-10">
                    Why Choose OPENDOOR?
                </p>
                <p className="mt-6 text-lg text-grey-variant-2">
                    At OPENDOOR, we’re redefining the home rental experience in
                    Bangladesh.
                </p>

                <div className="grid md:grid-cols-5 grid-cols-2 mt-10 lg:mt-0 lg:gap-10 gap-5 2xl:w-[65%] lg:translate-y-[40%]">
                    {perks.map((perk, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center border border-card text-center gap-5 p-5 bg-white rounded-2xl shadow-[0px_35px_40px_0px_rgba(0,0,0,0.07)]"
                        >
                            <span className="p-2 border border-card rounded text-primary">
                                {perk.icon}
                            </span>
                            <p className="text-base font-normal">{perk.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Header;
