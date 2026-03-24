"use client";

import { CopyIcon, TickIcon, TickSquareIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/ResponsiveDialog";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useGenerateOwnerContractMutation, useLazyGetSignedContractQuery, useLazyGetUnsignedContractQuery, useSignContractMutation } from "@/redux/reducers/contact/ownerContractApi";
import { resetPdfLoading, setIsSigned, setPdfLoading } from "@/redux/reducers/contact/pdfPreviewSlice";
import { openEndToEndModal, resetListingModal, setListingOption, setSelectedPackageResponse, setTransactionDetails } from "@/redux/reducers/listingModal/listingModalSlice";
import { useSelectPackageMutation } from "@/redux/reducers/package/selectPackageApi";
import { useLazyGetReceiptQuery } from "@/redux/reducers/property/propertyApi";
import { setAddPropertyDetailsModal } from "@/redux/reducers/property/propertySlice";
import { useEffect, useRef, useState } from "react";
import ErrorAlertMessage from "./AddProperty-steps/ErrorAlertMessage";
import PackageDetailsModal from "./PackageDetailsModal";
import ShortTermModal from "./ShortTermModal";
import TermsAndConditionsSection from "./TermsAndConditionsSection";

const prefixUrl = "https://opendoor-docs-dev.s3.ap-southeast-2.amazonaws.com/";


const OPTIONS = [
  {
    id: "BASIC",
    title: "Basic",
    subtitle: "",
    features: [
      "Property Ad Posting",
      "smartView (Virtual Tour + Photos)",
    ],
  },
  {
    id: "SMART",
    title: "Smart",
    subtitle: "",
    features: [
      "Property Ad Posting",
      "smartView (Virtual Tour + Photos)",
      "Viewing Request Log Dashboard",
      "Viewing Request Management",
      "Tenant Referencing",
      "Renter Verification",
    ],
  },
  {
    id: "SMARTPLUS",
    title: "Smart Plus",
    subtitle: "",
    features: [
      "Property Ad Posting",
      "smartView (Virtual Tour + Photos)",
      "Viewing Request Log Dashboard",
      "Viewing Request Management",
      "Tenant Referencing",
      "Renter Verification",
      "Automated Rent Collection",
      "Home Inspection",
    ],
  },
];

interface ListingOptionModalProps {
  open: boolean;
  onClose: () => void;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | null;
}



export default function ListingOptionModal({
  open,
  onClose,
  propertyType,
}: ListingOptionModalProps) {
  const availableOptions =
  propertyType === "COMMERCIAL"
    ? OPTIONS.filter((option) => option.id === "BASIC")
    : OPTIONS;
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.listingModal.listingOption);
  const [selectPackage, { isLoading }] = useSelectPackageMutation();
  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [triggerReceipt] = useLazyGetReceiptQuery();
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{ label: string; amount: number }[]>([]);
  const selectedPackageResponse = useAppSelector((state) => state.listingModal.selectedPackageResponse);
  const isSigned = useAppSelector((state) => state.pdfPreview.isSigned);
  const transactionId = useAppSelector((state) => state.listingModal.transactionId);
  const serviceRequestId = useAppSelector((state) => state.listingModal.serviceRequestId);
  const [generateOwnerContract, { isLoading: isGeneratingContract }] = useGenerateOwnerContractMutation();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSignStep, setIsSignStep] = useState(false);
  const [contractUrl, setContractUrl] = useState<string | null>(null);
  const [triggerUnsignedContract] = useLazyGetUnsignedContractQuery();
  const [triggerSingedContract] = useLazyGetSignedContractQuery();
  const [signContract, { isLoading: isSigningContract }] = useSignContractMutation();
  const [contractId, setContractId] = useState<string | null>(null);
  const [packageDetailsOpen, setPackageDetailsOpen] = useState(false);
  const [shortTermModalOpen, setShortTermModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };


  /*useEffect(() => {
    if (propertyType === "COMMERCIAL") {
      dispatch(setListingOption("BASIC"));
    }
  }, [propertyType, dispatch]);*/

  const selectedRef = useRef(selected);
  const propertyTypeRef = useRef(propertyType);

  useEffect(() => {
    selectedRef.current = selected;
    propertyTypeRef.current = propertyType;
  }, [selected, propertyType]);

  useEffect(() => {
    if (paymentError) {
      const timeout = setTimeout(() => {
        setPaymentError("");
      }, 10000); // 10 seconds

      return () => clearTimeout(timeout); // cleanup
    }
  }, [paymentError]);


  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "PAYMENT_SUCCESS") {
        const { tran_id, serviceRequestId } = event.data;
        if (!tran_id || !serviceRequestId) return;

        try {
          const response = await triggerReceipt({ serviceRequestId, transactionId: tran_id }).unwrap();

          if (response?.success && response.data?.receiptUrl) {
            // Receipt verified — now recall the package API
            const recheckResponse = await selectPackage({
              package: selectedRef.current!,
              propertyType: propertyTypeRef.current!,
            }).unwrap();

            const { proceed, enlistingEnabled, isPaid } = recheckResponse;

            if (proceed && enlistingEnabled && isPaid) {
              dispatch(setSelectedPackageResponse(recheckResponse));
              dispatch(openEndToEndModal());
              dispatch(setAddPropertyDetailsModal(true));
              setWaitingForPayment(false);
              setPaymentError("");
              onClose();
              setShowInvoice(false); // reset invoice mode
              dispatch(resetListingModal());
              setShowInvoice(false);         // reset invoice mode
              setInvoiceData([]);            // clear invoice items
              setPaymentError("");
              setContractUrl(null);
              setIsAgreed(false);
              dispatch(resetPdfLoading());
              setContractId(null);
              setIsSignStep(false);
              dispatch(setIsSigned(false));
            } else {
              setWaitingForPayment(false);
              setPaymentError("Payment couldn't be varified. Please try again.");
            }
          } else {
            setWaitingForPayment(false);
            setPaymentError("Receipt verification failed. Please try again.");
          }
        } catch (err) {
          console.error("Receipt verification or re-check error:", err);
          setWaitingForPayment(false);
          setPaymentError("Payment verification failed. Please try again.");
        }

        /*dispatch(openEndToEndModal());
              dispatch(setAddPropertyDetailsModal(true));
              setWaitingForPayment(false);
              setPaymentError("");
              onClose();*/
      }

      if (event.data?.type === "PAYMENT_FAILED") {
        setWaitingForPayment(false);
        setPaymentError("Payment failed. Please try again.");
      }
    };


    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);



  const handleContinue = async () => {
    if (!selected || !propertyType) return;

    const requestBody = { package: selected!, propertyType: propertyType! };

    try {
      const response = await selectPackage(requestBody).unwrap();
      console.log("📦 Full package selection response:", response);

      dispatch(setSelectedPackageResponse(response));

      const { proceed, enlistingEnabled, isPaid, paymentLink, invoice, serviceRequestId } = response;

      const canProceed =
        selected === "BASIC"
          ? proceed && enlistingEnabled && isPaid
          : proceed && enlistingEnabled;

      // --- NEW BASIC FLOW pt1 START ---
      if (selected === "BASIC") {
        if (proceed && enlistingEnabled && isPaid) {
          // Already paid, skip bank invoice and go straight to property creation modal
          onClose();
          setShortTermModalOpen(true);
          return;
        }

        // Otherwise show bank invoice with BRAC Bank details
        if (invoice && serviceRequestId) {
          setInvoiceData(
            invoice.items.map((item) => ({
              label: item.name,
              amount: item.total,
            }))
          );

          dispatch(
            setTransactionDetails({
              transactionId: "", // No payment link for manual bank transfer
              serviceRequestId: response.serviceRequestId!,
            })
          );

          setShowInvoice(true);
        }
        return; // Exit here so we don’t trigger old BASIC flow
      } //NEW BASIC FLOW END pt1


      // --- OLD BASIC FLOW (commented for rollback) ---
      {/*if (canProceed) {
        //dispatch(openEndToEndModal()); //putting short Term modal between Add-propdetails modal and package selection
        //dispatch(setAddPropertyDetailsModal(true)); ////putting short Term modal between Add-propdetails modal and package selection
        onClose();
        setShortTermModalOpen(true);
      } else if (paymentLink && invoice && response.serviceRequestId) {
         setInvoiceData(
            invoice.items.map((item) => ({
              label: item.name,
              amount: item.total,
            }))
          );
        dispatch(setTransactionDetails({
          transactionId: "", 
          serviceRequestId: response.serviceRequestId,
        }));
        setShowInvoice(true);
      }*/}

      // Flow for SMART / SMARTPLUS remains same, Part of new flow pt2
      if (canProceed) {
        onClose();
        setShortTermModalOpen(true);
      } else if (paymentLink && invoice && response.serviceRequestId) {
        setInvoiceData(
          invoice.items.map((item) => ({
            label: item.name,
            amount: item.total,
          }))
        );
        dispatch(
          setTransactionDetails({
            transactionId: "",
            serviceRequestId: response.serviceRequestId,
          })
        );
        setShowInvoice(true);
      } // end of new flow pt-2
    } catch (error) {
      console.error("❌ Package selection failed:", error);
    }
  };


  const handlePayNow = () => {
    if (!serviceRequestId) return;

    // Assuming selectPackage was already called and stored serviceRequestId
    const paymentLink = selectedPackageResponse?.paymentLink;
    //console.log("🔗 Payment link:", paymentLink);
    if (paymentLink) {
      window.open(paymentLink, "_blank");
      setWaitingForPayment(true);
    }
  };



  return (
    <Dialog 
      open={open} 
      onOpenChange={(val) => {
        if (!val) {
          if (!waitingForPayment){
            onClose();
            dispatch(resetListingModal());
            setShowInvoice(false);         // reset invoice mode
            setInvoiceData([]);            // clear invoice items
            setPaymentError("");
            setContractUrl(null);
            setIsAgreed(false);
            dispatch(resetPdfLoading());
            setContractId(null);
            setIsSignStep(false);
            dispatch(setIsSigned(false));
          }
        } 
      }}
    >
      <DialogContent
        onInteractOutside={(e) => waitingForPayment && e.preventDefault()}
        onEscapeKeyDown={(e) => waitingForPayment && e.preventDefault()}
        className={cn(
          "rounded-[16px] lg:rounded-[30px]",
          showInvoice ? "md:min-w-[70%] lg:min-w-[50%]" : "md:min-w-[90%] lg:min-w-[70%]"
        )}
        >
        <DialogHeader className="flex flex-row items-start justify-between mb-1">
          <DialogTitle className="text-base text-sm sm:text-normal">
            {showInvoice ? "Invoice" : "Select your listing option"}
          </DialogTitle>
        </DialogHeader>

        {/* Option Buttons */}
        <div className="overflow-y-auto max-h-[55vh] pr-1">
          {!showInvoice && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-4">
              {availableOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setIsAgreed(false);
                    dispatch(setListingOption(option.id as "BASIC" | "SMART" | "SMARTPLUS"));
                    dispatch(setPdfLoading(true));

                    generateOwnerContract({ package: option.id as "BASIC" | "SMART" | "SMARTPLUS" })
                    .unwrap()
                    .then(async (res) => {
                      console.log("Contract generation response:", res);
                      if (res?.success  && res.contractId) {
                        setContractId(res.contractId);
                        if(res?.step === "SIGN_CONTRACT"){  
                          try {
                              const contractRes = await triggerUnsignedContract(res.contractId).unwrap();
                              dispatch(setIsSigned(false));
                              if (contractRes?.success && contractRes.downloadUrl) {
                                setContractUrl(contractRes.downloadUrl);
                                setIsSignStep(true);
                              } else {
                                setContractUrl(null);
                                setIsSignStep(false);
                                setPaymentError("Failed to fetch contract link. Please select a package again.");
                              }
                            } catch (err) {
                              console.error("Unsigned contract fetch failed:", err);
                              setContractUrl(null);
                              setIsSignStep(false);
                              setPaymentError("Failed to load contract. Please select a package again.");
                            }
                        }
                        else if (res?.step === "PROPERTY_CREATION") {
                          setIsSignStep(false);
                          try {
                              const contractRes = await triggerSingedContract(res.contractId).unwrap();
                              if (contractRes?.success && contractRes.downloadUrl) {
                                setContractUrl(contractRes.downloadUrl);
                                setIsAgreed(true);
                                dispatch(setIsSigned(true));
                              } else {
                                setContractUrl(null);
                                setIsSignStep(false);
                                dispatch(setIsSigned(false));
                                setPaymentError("Failed to fetch contract link. Please select a package again.");
                              }
                            } catch (err) {
                              console.error("Unsigned contract fetch failed:", err);
                              setContractUrl(null);
                              setIsSignStep(false);
                              dispatch(setIsSigned(false));
                              setPaymentError("Failed to load contract. Please select a package again.");
                            }
                        }
                        else{
                          setContractUrl(null);
                          setIsSignStep(false);
                          dispatch(setIsSigned(false));
                          setPaymentError("Unexpected step. Please select a package again.");
                        }
                      } 
                      else {
                        setContractUrl(null);
                        setIsSignStep(false);
                        dispatch(setIsSigned(false));
                        setPaymentError("Failed to load contract. Please select a package again.");
                      }
                    })
                    .catch((err) => {
                      console.error("Contract generation failed:", err);
                      setContractUrl(null);
                      setIsSignStep(false);
                      dispatch(setIsSigned(false));
                      setPaymentError("Something went wrong. Please select a package again.");
                    });
                  }}
                  className={cn(
                    "relative flex-1 text-left border rounded-xl transition-all",
                    selected === option.id
                      ? "border-primary"
                      : "border-muted/10"
                  )}
                >
                  {/* Tick Icon on Top Right */}
                  <div className="absolute top-3 right-3 w-5 h-5">
                    {selected === option.id ? (
                      <TickSquareIcon className="w-4 h-4 text-primary" />
                    ) : (
                      <span className="invisible">
                        <TickSquareIcon className="w-4 h-4 text-primary" />
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 space-y-2 h-full mt-2">
                    <p className="font-light text-sm sm:text-normal text-center">{option.title}</p>
                    <ul className="mt-3 space-y-1">
                      {option.features?.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-secondary/80 text-left">
                          <TickIcon className="w-4 h-4 text-primary shrink-0 mt-[2px]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              ))}
            </div>
            {/* Right-aligned See Package Details link */}
            <div className="flex justify-end mt-2">
              <Button
              variant={"link"}
              size={"sm"}
                onClick={() => setPackageDetailsOpen(true)}
                className="text-xs text-right sm:text-sm text-primary font-normal hover:underline transition hidden"
              >
                See Package Details
              </Button>
            </div>
          </div>
          )}
          <PackageDetailsModal open={packageDetailsOpen} onClose={() => setPackageDetailsOpen(false)} />

          {showInvoice && (
            <div className="rounded-xl p-1">
              <h3 className="font-light text-base sm:text-lg mb-5">Bill Summary</h3>
              <div className="space-y-3 text-sm sm:text-base">
                {invoiceData.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.label}</span>
                    <span>৳{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-3 flex justify-between font-light text-lg sm:text-xl">
                <span>Total</span>
                <span>
                  ৳{invoiceData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </span>
              </div>
              {/* Add Bank Details if BASIC, Temporary patch */}
              {selected === "BASIC" && (
                
                <div className="mt-5 text-sm sm:text-base border-t pt-3 space-y-2">
                  <table className="w-full mt-3">
                    <tbody>
                      <tr>
                        <td className="text-left font-light whitespace-nowrap">Bank Name:</td>
                        <td className="text-right">BRAC Bank Ltd.</td>
                      </tr>
                      <tr>
                        <td className="text-left font-light whitespace-nowrap">Account No:</td>
                        <td className="text-right flex items-center justify-end gap-2">
                          1234567890
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy("1234567890", "account")}
                            className="h-5 w-5 p-0"
                          >
                            <CopyIcon className="w-4 h-4" />
                          </Button>
                          {copiedField === "account" && (
                            <span className="text-xs text-primary ml-1">Copied</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-left font-light whitespace-nowrap">Receiver:</td>
                        <td className="text-right">OPENDOOR Ltd.</td>
                      </tr>
                      <tr>
                        <td className="text-left font-light whitespace-nowrap">Branch:</td>
                        <td className="text-right">Banani</td>
                      </tr>
                      <tr>
                        <td className="text-left font-light whitespace-nowrap">Reference:</td>
                        <td className="text-right flex items-center justify-end gap-2">
                          {serviceRequestId}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(serviceRequestId!, "reference")}
                            className="h-5 w-5 p-0"
                          >
                            <CopyIcon className="w-4 h-4" />
                          </Button>
                          {copiedField === "reference" && (
                            <span className="text-xs text-primary ml-1">Copied</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-8 text-justify">After completing the transfer, kindly send the payment slip or transaction reference number to our support team for verification.</p>
                  <p className="mt-1 italic text-justify">
                    <span className="text-primary">Note:</span> Please ensure the exact service charge amount is transferred to avoid processing delays.
                  </p>
                </div>
              )} {/*Temporary patch till payment gateway is implemented*/}
            </div>
          )}

          {selected && contractUrl && !showInvoice && (
            <TermsAndConditionsSection
              pdfUrl={contractUrl}
              agreed={isAgreed}
              onAgreementChange={setIsAgreed}
            />
          )}

          {selected && contractUrl && isAgreed && contractId && isSignStep && !showInvoice && (
            <div className="flex items-center justify-between gap-4">
              {/* Left Column (70%) */}
              <p className="w-[70%] text-sm text-muted-foreground">
                Please digitally sign this contract to continue.
              </p>

              {/* Right Column (30%) */}
              <div className="w-[30%] flex justify-end">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center text-xs font-normal hover:text-primary text-primary border-primary"
                  disabled={isSigningContract}
                  onClick={async () => {
                    try {
                      if (!contractId) return;
                      const res = await signContract(contractId).unwrap();

                      if (res?.success && res.signedContractUrl) {
                        try {
                            const contractRes = await triggerSingedContract(contractId).unwrap();
                            if (contractRes?.success && contractRes.downloadUrl) {
                              dispatch(setPdfLoading(true));
                              setContractUrl(contractRes.downloadUrl);
                              dispatch(setIsSigned(true));
                              setIsSignStep(false);
                            } else {
                              setContractUrl(null);
                              setIsSignStep(false);
                              dispatch(setIsSigned(false));
                              setPaymentError("Failed to fetch contract. Please select a package again.");
                            }
                          } catch (err) {
                            console.error("Unsigned contract fetch failed:", err);
                            setContractUrl(null);
                            setIsSignStep(false);
                            dispatch(setIsSigned(false));
                            setPaymentError("Failed to load contract. Please select a package again.");
                          }
                      } else {
                        setPaymentError("Failed to sign contract. Please try again.");
                      }
                    } catch (err) {
                      dispatch(setIsSigned(false));
                      console.error("Sign contract failed:", err);
                      setPaymentError("Something went wrong while signing. Please try again.");
                    }
                  }}
                >
                  {isSigningContract ? (
                    <>
                      <span className="animate-spin mr-2 w-3 h-3 rounded-full border-t-2 border-white border-solid" />
                      Signing...
                    </>
                  ) : (
                    "Sign Contract"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
        {paymentError && (
          <div>
            <ErrorAlertMessage
              message={paymentError}
              className="text-center text-xs"
            />
          </div>
        )}

        <div className="mt-3 mb-2 flex justify-end">
          <Button
            disabled={!selected || isLoading || waitingForPayment || isGeneratingContract || !isAgreed || !isSigned }
            //onClick={showInvoice ? handlePayNow : handleContinue} //previous flow
            onClick={ //for temporary patch
              showInvoice
                ? selected === "BASIC"
                  ? () => {
                      // Close modal on Done
                      onClose();
                      dispatch(resetListingModal());
                      setShowInvoice(false);
                      setInvoiceData([]);
                      setPaymentError("");
                      setContractUrl(null);
                      setIsAgreed(false);
                      dispatch(resetPdfLoading());
                      setContractId(null);
                      setIsSignStep(false);
                      dispatch(setIsSigned(false));
                    }
                  : handlePayNow
                : handleContinue
            }
            className={cn(
              "transition-all duration-200",
              showInvoice
                ? "mt-2 sm:mt-0 w-full sm:w-1/4 bg-secondary hover:bg-secondary/90 text-white font-normal shadow-md"
                : "w-full sm:w-[33%] bg-primary"
            )}
          >
            {/*{isLoading || isGeneratingContract //ommitted for rollback to previous flow
              ? "Processing..."
              : waitingForPayment
              ? "Waiting for payment"
              : showInvoice
              ? "Pay Now"
              : "Continue"}*/}
            {showInvoice
              ? selected === "BASIC"
                ? "Done"
                : "Pay Now"
              : isLoading || isGeneratingContract
              ? "Processing..."
              : waitingForPayment
              ? "Waiting for payment"
              : "Continue"}
          </Button>
        </div>
      </DialogContent>
      <ShortTermModal
        open={shortTermModalOpen}
        onClose={() => {
          setShortTermModalOpen(false);
        }}
        onContinue={() => {
        dispatch(openEndToEndModal());
        dispatch(setAddPropertyDetailsModal(true));
        }}
      />
    </Dialog>
  );
}
