"use client";
import { useLoginMutation } from "@/redux/reducers/auth/authApi";
import { useGetUsersQuery } from "@/redux/reducers/user/userApi";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Login() {
    const token = useSelector((state: RootState) => state.auth.token);
    const [id, setId] = useState("");
    const [pass, setPass] = useState("");

    const [login, { data, error }] = useLoginMutation();

    const {
        data: users,
        error: usersError,
        isLoading,
        isFetching,
        refetch,
    } = useGetUsersQuery(
        token ? { skip: 0, take: 10, sort: "-createdAt" } : undefined,
        { skip: !token }
    );
    useEffect(() => {
        console.log("🚀 ~ Login ~ users:", users);
    }, [users]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        console.log("🚀 ~ handleSubmit ~ pass:", pass, id);
        let data = {
            email: id,
            password: pass,
        };
        login(data);
    };
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center text-4xl gap-2">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">ID: </label>
                    <input
                        type="text"
                        id="id"
                        className="border"
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className="">
                    <label htmlFor="pass">Password: </label>
                    <input
                        type="password"
                        id="pass"
                        className="border"
                        onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                <div className="">
                    <button
                        type="submit"
                        className="border bg-red-500 px-3 py-2 mt-3 rounded"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
