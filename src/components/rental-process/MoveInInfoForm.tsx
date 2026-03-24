"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle } from "lucide-react";
import { useSubmitMoveInInfoMutation } from "@/redux/reducers/rental-process/rentalProcessApi";
import { toast } from "sonner";

import { MoveInInfo } from "@/types/rental-process";

interface MoveInInfoFormProps {
    token: string;
    password?: string;
    status: string;
    moveInInfo?: MoveInInfo | null;
    onSuccess: () => void;
}

export function MoveInInfoForm({
    token,
    password,
    status,
    moveInInfo,
    onSuccess,
}: MoveInInfoFormProps) {
    const [submitMoveIn, { isLoading }] = useSubmitMoveInInfoMutation();
    const [date, setDate] = useState(moveInInfo?.moveInDate || "");
    const [note, setNote] = useState(moveInInfo?.note || "");

    // Show only when payment verified or completed
    const isVisible = ["PAYMENT_VERIFIED", "COMPLETED", "MOVE_IN_SCHEDULED"].includes(status);

    if (!isVisible) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) {
            toast.error("Please select a move-in date.");
            return;
        }

        try {
            const res = await submitMoveIn({
                token,
                password,
                data: { moveInDate: date, note }
            }).unwrap();

            if (res.success) {
                toast.success("Move-in information submitted successfully!");
                onSuccess();
            }
        } catch (err) {
            toast.error("Failed to submit move-in info. Please try again.");
            console.error(err);
        }
    };

    if (moveInInfo?.moveInDate) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Move-in Scheduled
                    </CardTitle>
                    <CardDescription>
                        You have scheduled your move-in for <strong>{new Date(moveInInfo.moveInDate).toDateString()}</strong>.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Coordinate Move-in</CardTitle>
                <CardDescription>
                    Please let us know your preferred move-in date and any special requests.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                        <Input
                            id="moveInDate"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Notes / Special Requests (Optional)</Label>
                        <Textarea
                            id="note"
                            placeholder="e.g. Will arrive in the afternoon..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Submitting..." : "Schedule Move-in"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
