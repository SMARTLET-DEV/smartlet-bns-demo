"use client";

import { useState, useEffect, useCallback } from "react";

const getSessionKey = (role: string, token: string) => `rental_password_${role}_${token}`;

export const useRentalAuth = (role: "renter" | "owner", token: string) => {
    const [password, setPasswordState] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!role || !token) return;
        const key = getSessionKey(role, token);
        const stored = window.sessionStorage.getItem(key);
        if (stored) {
            setPasswordState(stored);
        }
        setIsInitialized(true);
    }, [role, token]);

    const setPassword = useCallback(
        (newPassword: string) => {
            const key = getSessionKey(role, token);
            window.sessionStorage.setItem(key, newPassword);
            setPasswordState(newPassword);
        },
        [role, token]
    );

    const clearPassword = useCallback(() => {
        const key = getSessionKey(role, token);
        window.sessionStorage.removeItem(key);
        setPasswordState(null);
    }, [role, token]);

    return { password, setPassword, clearPassword, isInitialized };
};
