export type RentalProcessStatus =
    | "DOCUMENTS_PENDING"
    | "DOCUMENTS_SUBMITTED"
    | "DOCUMENTS_REJECTED" // Inferred from spec
    | "DOCUMENTS_VERIFIED"
    | "AWAITING_PAYMENT_INSTRUCTION"
    | "PAYMENT_INSTRUCTION_READY"
    | "AWAITING_PAYMENT_CONFIRMATION" // Was PAYMENT_PROOF_SUBMITTED
    | "PAYMENT_REJECTED" // Inferred from spec
    | "PAYMENT_CONFIRMED"
    | "AWAITING_OWNER_DISPATCH"
    | "OWNER_RECEIVED_CONFIRMED"
    | "MOVE_IN_SCHEDULED"
    | "COMPLETED";

export type RentalFileType =
    | "RENTER_IDENTIFICATION_DOCUMENT"
    | "RENTER_BUSINESS_CARD"
    | "PAYMENT_PROOF_RECEIPT"
    | "INVOICE"
    | "PAYMENT_CONFIRMATION"
    | "OTHER";

export interface RentalFile {
    id: string;
    fileType: RentalFileType;
    originalName: string;
    mimeType: string;
    uploadedAt: string;
    s3Key?: string; // Only for renter/admin internal use, not shown to owner
}

export interface RentalProperty {
    id: string;
    readablePropertyId?: string;
    title: string;
    street_address: string;
    address?: string; // Some parts of the app use address
    area: string;
    city: string;
    rent_amount: number;
    price?: number;
    deposit_months: number;
    deposit_amount?: number;
    serviceCharge?: number;
    media: string[];
    createdAt?: string;
}

export interface RenterCustomer {
    id: string;
    fullName: string;
    phoneNumber: string;
    whatsappNumber?: string;
    email?: string;
}

export interface OwnerCustomer {
    id: string; // Minimal details usually
    fullName?: string;
}

export interface RentalProcessTimestamps {
    paymentConfirmedAt?: string | null;
    ownerReceivedConfirmedAt?: string | null;
    moveInSubmittedAt?: string | null;
}

export interface MoveInInfo {
    moveInDate: string;
    note?: string;
}

export interface PaymentProofSubmission {
    payerAccountNumber: string;
    amount: number;
    depositDate: string;
    receiptFile?: RentalFile;
}

export interface PaymentInstruction {
    amount: number;
    method: string;
    dueDate?: string;
    accountName: string;
    accountNumber: string;
    bankName?: string;
    branch?: string;
    routing?: string;
}

// Full Renter Response
export interface RenterProcessResponse {
    success: boolean;
    process: {
        id: string;
        status: RentalProcessStatus;
        property: RentalProperty;
        renterCustomer: RenterCustomer;
        ownerCustomer: OwnerCustomer;
        files: RentalFile[];
        renterDocuments?: { // Helper for UI, derived or from backend if it groups them
            idDoc?: RentalFile;
            businessCard?: RentalFile;
        };
        paymentProof?: RentalFile; // Helper
        paymentProofData?: PaymentProofSubmission; // Added for UI
        paymentInstruction: PaymentInstruction | null;
        moveInMeta: MoveInInfo | null;
        documentsRejectedReason: string | null;
        paymentRejectedReason: string | null;
        createdAt: string;
        updatedAt: string;
    };
}


// Sanitized Owner Response
export interface OwnerProcessResponse {
    success: boolean;
    process: {
        id: string;
        status: RentalProcessStatus;
        property: RentalProperty;
        renter: RenterCustomer; // "renter" field instead of "renterCustomer" in spec
        files: RentalFile[]; // Only renter uploaded files
        timestamps: RentalProcessTimestamps;
        moveInMeta: MoveInInfo | null;
        renterDocuments?: { // Helper for UI
            idDoc?: RentalFile;
            businessCard?: RentalFile;
        };
        paymentProof?: RentalFile; // Helper
        paymentProofData?: PaymentProofSubmission; // Added for UI
    };
}
