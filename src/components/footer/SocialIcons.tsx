import {
    FacebookNew,
    InstagramNew,
    LinkedinIcon,
    TiktokIcon,
    YoutubeNew,
} from "@/assets/icons"; // Update the path!

const socialLinks = [
    {
        name: "Facebook",
        href: "https://www.facebook.com/people/Opendoor/61575304649184/",
        icon: <FacebookNew className="w-6 h-6" fill="black" />,
    },
    {
        name: "Instagram",
        href: "https://www.instagram.com/opendoor.ltd/",
        icon: <InstagramNew className="w-6 h-6" fill="black" />,
    },
    {
        name: "YouTube",
        href: "https://www.youtube.com/@OPENDOOR_Ltd",
        icon: <YoutubeNew className="w-6 h-6" fill="black" />,
    },
    {
        name: "TikTok",
        href: "https://www.tiktok.com/@opendoor.ltd",
        icon: <TiktokIcon className="w-6 h-6 text-black" />,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/opendoorltd/",
        icon: <LinkedinIcon className="w-6 h-6" fill="black" />,
    },
];

export default function SocialIcons() {
    return (
        <div className="flex items-center 2xl:gap-3 lg:gap-1 gap-3 text-black flex-wrap">
            {socialLinks.map((item, idx) => (
                <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    aria-label={item.name}
                    className="bg-white rounded-sm p-2 transition hover:scale-110 border border-gray-300"
                >
                    {item.icon}
                </a>
            ))}
        </div>
    );
}
