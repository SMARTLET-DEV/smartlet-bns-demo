import { ChevronRightIcon } from "@/assets/icons";
import FavoritesList from "@/components/dashboard/favorites-list/FavoritesList";
import Link from "next/link";

const FavoritesPage = () => {
    return (
        <div className="flex-grow">
            <div className="lg:mb-12 mb-4">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-light">
                    Manage Favorites
                </h1>
                <div className="lg:flex hidden items-center gap-4 mt-4">
                    <Link href="/" className="text-muted">
                        Home
                    </Link>
                    <p>
                        <ChevronRightIcon className="w-3 h-3" />
                    </p>
                    <p>Manage Favorites</p>
                </div>
            </div>
            <div>
                <FavoritesList />
            </div>
        </div>
    );
};

export default FavoritesPage;
