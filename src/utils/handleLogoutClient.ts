import { store, persistor } from "@/redux/store";
import { logout } from "@/redux/reducers/auth/authSlice";
/*
self note
Token is Only in Redux (and persisted through Redux Persist)
Not stored manually in localStorage
Not stored in cookies
*/
export const handleClientLogout = async () => {
    try {
        store.dispatch(logout());

        await persistor.purge();
    } catch (err) {
        console.error("Logout handler error:", err);
    }
};
