import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, MessageCircle } from "lucide-react";
import { RenterCustomer } from "@/types/rental-process";

interface RenterInfoCardProps {
    renter: RenterCustomer;
}

export function RenterInfoCard({ renter }: RenterInfoCardProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Renter Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Name</p>
                        <p className="font-medium text-gray-900 leading-tight">{renter.fullName}</p>
                    </div>
                </div>
                {renter.email && (
                    <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                            <p className="font-medium text-gray-900 leading-tight">{renter.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

