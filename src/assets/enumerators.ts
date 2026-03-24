export enum RentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    RENTED = "RENTED",
    CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
    PAID = "PAID",
    DUE = "DUE",
}

export enum ApplicationStep {
    STEP_1 = "1. Application Info",
    STEP_2 = "2. Contract Signing",
    STEP_3 = "3. Payment",
}

export interface PropertyDetails {
    id: string;
    imgUrl: string;
    title: string;
    location: string;
    price: number;
    bed: number;
    bath: number;
    size: number;
}

// Base interface for all property states
interface BaseProperty {
    property: {
        id: string;
        title: string;
        address?: string;
        area: string;
        city: string;
        media: string[];
        bedrooms: number;
        bathrooms: number;
        size: number;
        price: number;
        popularLandmarks?: string;
        nearbyLocations?: string;
        longitude?: number;
        latitude?: number;
    };
    agentNumber: string;
    preferredMoveInMonth: string;
}

// Interface for properties that are rented
export interface RentedPropertyState extends BaseProperty {
    id: string;
    status: RentStatus.RENTED;
    paymentStatus: PaymentStatus;
    propertyId: string;
    renterId: string;
    ownerId: string;
    rentAmount: string;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    isRecurring: boolean;
    rentalType: string;
}

// Interface for properties that are not rented
export interface NonRentedPropertyState extends BaseProperty {
    status: RentStatus.PENDING | RentStatus.APPROVED;
    currentStep: ApplicationStep;
}

export interface RejectedPropertyState extends BaseProperty {
    status: RentStatus.REJECTED;
    rejectionReason: string;
}

// Union type that represents all possible property states
export type PropertyState =
    | RentedPropertyState
    | NonRentedPropertyState
    | RejectedPropertyState;

export interface PropertyStateOptions {
    status: RentStatus;
    paymentStatus?: PaymentStatus;
    options: string[];
}
