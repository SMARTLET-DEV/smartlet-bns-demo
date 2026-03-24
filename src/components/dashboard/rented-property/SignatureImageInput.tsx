import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { EyeIcon, UploadIcon, XIcon } from "@/assets/icons";
import { StepperMethods } from "@/components/properties/apply-for-rent/RenterTimeline";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    useGetContractMutation,
    useUploadSignatureMutation,
} from "@/redux/reducers/rental-applications/RentalApplicationApi";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../ui/button";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const fileSchema = z.custom<File | undefined>(
    (file) => {
        if (!file) {
            return true; // Allow undefined/null for initial state
        }
        if (!(file instanceof File)) {
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            return false;
        }
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            return false;
        }
        return true;
    },
    {
        message: "Please upload a valid image file (JPEG, PNG) under 5MB",
    }
);

const signatureSchema = z.object({
    signature: fileSchema.refine((file) => !!file, {
        message: "Signature image is required",
    }),
}) as z.ZodType<{ signature: File | undefined }>;

type SignatureFormValues = z.infer<typeof signatureSchema>;

interface SignatureImageInputProps {
    setUploaded: React.Dispatch<React.SetStateAction<boolean>>;
    applicationId?: string;
    stepperMethods: StepperMethods;
}

export default function SignatureImageInput({
    setUploaded,
    applicationId,
    stepperMethods,
}: SignatureImageInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [contract, setContract] = useState<string | null>(null);
    const dispatch = useDispatch();
    const application = useSelector(
        (state: RootState) => state.rentalApplication.application
    );

    const form = useForm<SignatureFormValues>({
        resolver: zodResolver(signatureSchema),
        defaultValues: {
            signature: undefined,
        },
        mode: "onChange",
    });

    const signatureValue = form.watch("signature");

    // Reset input element when form field is reset
    useEffect(() => {
        if (!signatureValue && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [signatureValue]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("signature", file);
        }
    };

    const [uploadSignature, { isLoading, isSuccess }] =
        useUploadSignatureMutation();
    const [getContract, { isLoading: isContractLoading }] =
        useGetContractMutation();

    const handleUpload = async () => {
        if (signatureValue && applicationId) {
            try {
                const formData = new FormData();
                formData.append("signature", signatureValue);
                await uploadSignature({ formData, id: applicationId });
                const contract = await getContract({ id: applicationId });
                setContract(contract?.data?.downloadUrl);
                setUploaded(true);
            } catch (error) {
                console.error("Error uploading signature:", error);
            }
        }
    };

    const handleDownloadSignedContract = async () => {
        try {
            if (applicationId) {
                const { data } = await getContract({ id: applicationId });
                setContract(data?.downloadUrl);
                window.open(data?.downloadUrl, "_blank");
            }
        } catch (error) {
            console.error("Error downloading signed contract:", error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleUpload)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="signature"
                    render={({
                        field: { value: fieldValue, onChange, ...field },
                    }) => (
                        <FormItem className="gap-3">
                            <FormLabel className="text-base flex items-center gap-2 justify-between font-normal data-[error=true]:text-secondary">
                                {application?.contractSigned || isSuccess
                                    ? "Contract has been signed successfully"
                                    : "Upload your signature"}
                                <div className="flex items-center gap-2">
                                    {!application?.contractSigned && (
                                        <>
                                            {!signatureValue && (
                                                <Button
                                                    onClick={() => {
                                                        inputRef.current?.click();
                                                    }}
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    Select File
                                                </Button>
                                            )}
                                            {signatureValue && !contract && (
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        isLoading || isSuccess
                                                    }
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <UploadIcon className="w-4 h-4 mr-2" />
                                                    )}
                                                    Upload
                                                </Button>
                                            )}
                                        </>
                                    )}

                                    {(contract ||
                                        application?.contractSigned) && (
                                        <Button
                                            type="button"
                                            onClick={
                                                handleDownloadSignedContract
                                            }
                                            disabled={isContractLoading}
                                        >
                                            {isContractLoading && (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            )}
                                            Download Signed Contract
                                        </Button>
                                    )}
                                </div>
                            </FormLabel>
                            <FormControl className="h-fit placeholder:text-muted">
                                <div>
                                    <Input
                                        {...field}
                                        ref={inputRef}
                                        type="file"
                                        accept={ACCEPTED_FILE_TYPES.join(",")}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    {signatureValue && (
                                        <div className="flex items-center gap-2 justify-between bg-background px-4 py-3 border rounded-lg text-secondary">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={URL.createObjectURL(
                                                        signatureValue
                                                    )}
                                                    alt="Preview"
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex flex-col justify-between">
                                                    <p className="text-base font-normal">
                                                        {signatureValue.name}
                                                    </p>
                                                    <p className="text-sm text-muted mt-1">
                                                        Support formats: JPEG,
                                                        PNG (Max 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="size-fit"
                                                    onClick={() => {
                                                        if (signatureValue) {
                                                            window.open(
                                                                URL.createObjectURL(
                                                                    signatureValue
                                                                ),
                                                                "_blank"
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <EyeIcon className="size-5 text-black" />
                                                </Button>

                                                {!isSuccess && !contract && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="size-fit"
                                                        onClick={() => {
                                                            form.setValue(
                                                                "signature",
                                                                undefined
                                                            );
                                                        }}
                                                    >
                                                        <XIcon className="size-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
