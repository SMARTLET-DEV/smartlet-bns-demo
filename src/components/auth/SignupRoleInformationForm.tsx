import { HomeOwnerIcon, RenterIcon } from "@/assets/icons";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { ROLES, signupSchema } from "./SignupModal";

type SignupFormData = z.infer<typeof signupSchema>;

const SignupRoleInformationForm = () => {
    const form = useFormContext<SignupFormData>();
    return (
        <>
            <p className="text-base sm:text-lg font-light">Choose Your Account Type</p>
            <div className="grid grid-cols-2 mt-5 gap-5">
                <div
                    onClick={() => form.setValue("role", ROLES.OWNER)}
                    className="cursor-pointer flex flex-col text-center items-center p-5 rounded-lg bg-card border border-transparent duration-300 group hover:border-primary"
                >
                    <p className="p-4 w-fit bg-white rounded-full group-hover:bg-primary text-primary group-hover:text-white duration-300">
                        <HomeOwnerIcon className="w-7 h-7" />
                    </p>
                    <p className="text-xl font-light mt-4">Homeowner</p>
                    <p className="text-muted mt-2 text-sm">
                        I am here to add my property for rent.
                    </p>
                </div>

                <div
                    onClick={() => form.setValue("role", ROLES.RENTER)}
                    className="cursor-pointer flex flex-col text-center items-center p-5 rounded-lg bg-card border border-transparent duration-150 group hover:border-primary"
                >
                    <p className="p-4 w-fit bg-white rounded-full group-hover:bg-primary text-primary group-hover:text-white duration-300">
                        <RenterIcon className="w-7 h-7" />
                    </p>
                    <p className="text-xl font-light mt-4">Tenant</p>
                    <p className="text-muted mt-2 text-sm">
                        I am here to find properties for rent.
                    </p>
                </div>
            </div>
        </>
    );
};

export default SignupRoleInformationForm;
