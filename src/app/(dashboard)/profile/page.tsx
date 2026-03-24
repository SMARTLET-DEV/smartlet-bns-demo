import { ChevronRightIcon } from "@/assets/icons";
import ProfileInfoForm from "@/components/dashboard/profile/ProfileInfoForm";
import Link from "next/link";

const ProfilePage = () => {
    return (
        <div className="flex-grow">
            <div className="mb-12">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light">Profile</h1>
                <div className="flex items-center gap-4 mt-4">
                    <Link href="/" className="text-muted">
                        Home
                    </Link>
                    <p>
                        <ChevronRightIcon className="w-3 h-3" />
                    </p>
                    <p>Profile Details</p>
                </div>
            </div>
            <div>
                <ProfileInfoForm />
            </div>
        </div>
    );
};

export default ProfilePage;
