"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ControlledInput } from "../common/ControlledInput";
import { ControlledTextarea } from "../common/ControlledTextarea";

import {
  addPropertyFormSchema,
  AddPropertyFormSchema,
} from "@/lib/validations/addAPropertySchema";

import { useSubmitAgentRequestMutation } from "@/redux/reducers/request/agentRequestApi";
import { useGetMeQuery } from "@/redux/reducers/user/userApi";
import { useToast } from "@/hooks/useToast";

import { SuccessIcon } from "@/assets/icons";

type AddPropertyFormProps = {
  title?: string;
  description?: string;
};

export function AddPropertyForm({ title, description }: AddPropertyFormProps) {
  const pathname = usePathname();
  const isSmartViewRoute = useMemo(() => pathname === "/smartview", [pathname]);

  const [submitAgentRequest] = useSubmitAgentRequestMutation();
  const { data: meData } = useGetMeQuery();
  const { success, error } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<AddPropertyFormSchema>({
    resolver: zodResolver(addPropertyFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      address: "",
      additionalMessage: "",
    },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: AddPropertyFormSchema) => {
    setErrorMessage("");

    // Defensive check (keep it, even though zod should validate)
    if (
      !data.firstName?.trim() ||
      !data.lastName?.trim() ||
      !data.email?.trim() ||
      !data.mobile?.trim() ||
      !data.address?.trim()
    ) {
      setErrorMessage("Please fill in all the required fields.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      await submitAgentRequest({
        fullName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.mobile,
        address: data.address,
        requestMessage: data.additionalMessage || "",
        userId: meData?.user?.id,
      }).unwrap();

      success(
        "Property listing request submitted successfully! We'll get back to you soon."
      );

      reset();
      setOpenDialog(true);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || "Something went wrong. Please try again.";
      error(errorMsg);
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDialogClose = () => setOpenDialog(false);

  return (
    <>
      <div className="lg:py-20 py-10 mt-5" id="add-property-form">
        <div className="container mx-auto px-5 flex flex-col items-center">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-[#f9f9f9] rounded-2xl p-4 sm:p-10 space-y-6 max-w-[820px] w-full shadow-sm"
            >
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-10">
                  {title}
                </h2>
              )}

              {description && (
                <p className="text-base text-[#191919] font-light text-center mb-8 max-w-xl mx-auto">
                  {description}
                </p>
              )}

              {/* Match Contact Us feel: same ControlledInput + bg-white */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ControlledInput
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  control={form.control}
                  className="bg-white"
                />

                <ControlledInput
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  control={form.control}
                  className="bg-white"
                />

                <ControlledInput
                  name="email"
                  label="Email"
                  placeholder="Enter your email address"
                  control={form.control}
                  className="bg-white"
                  type="email"
                />

                <ControlledInput
                  name="mobile"
                  label="Phone"
                  placeholder="Enter your phone number"
                  control={form.control}
                  className="bg-white"
                />

                {/* Address: full width ONLY on /smartview */}
                <div className={isSmartViewRoute ? "lg:col-span-2" : ""}>
                  <ControlledInput
                    name="address"
                    label="Address"
                    placeholder="Enter your full address"
                    control={form.control}
                    className="bg-white w-full"
                  />
                </div>

                {/* Message full width */}
                <div className="lg:col-span-2">
                  <ControlledTextarea
                    name="additionalMessage"
                    label="Additional Message"
                    placeholder="Enter your message"
                    control={form.control}
                    className="min-h-[120px] bg-white"
                  />

                  {errorMessage && (
                    <div className="mt-4 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="default"
                      className="mt-5 bg-transparent text-primary border border-primary hover:bg-primary hover:text-white transition duration-300 sm:px-8 sm:py-5 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Make a Request"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={openDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="w-[90%] max-w-md rounded-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl text-left font-normal">
              Request Listing Assistance
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-4 text-center py-8">
            <SuccessIcon className="w-24 h-24 text-green-600" />
            <p className="text-base font-medium text-green-700">
              Property listing request submitted successfully!
            </p>
            <Button
              className="mt-4 border border-primary text-primary hover:bg-primary hover:text-white transition"
              onClick={handleDialogClose}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
