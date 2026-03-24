"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";

interface PasswordPromptProps {
    onSubmit: (password: string) => void;
    error?: string;
    isLoading?: boolean;
}

export function PasswordPrompt({
    onSubmit,
    error,
    isLoading,
}: PasswordPromptProps) {
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.trim()) {
            onSubmit(password.trim());
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md border-none shadow-none bg-white">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-center text-2xl font-light">
                        Protected Access
                    </CardTitle>
                    <CardDescription className="text-center text-muted font-medium">
                        Please enter the password to view this rental process.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-base font-normal">Password</Label>
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="py-3 px-4 h-fit placeholder:text-muted"
                            />
                            {error && (
                                <p className="text-sm font-medium text-destructive">{error}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            variant="outline"
                            className="w-full border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-normal"
                            disabled={isLoading || !password.trim()}
                        >
                            {isLoading ? "Verifying..." : "Access"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-xs text-muted-foreground">
                    Secure Tenant & Owner Portal
                </CardFooter>
            </Card>
        </div>
    );
}
