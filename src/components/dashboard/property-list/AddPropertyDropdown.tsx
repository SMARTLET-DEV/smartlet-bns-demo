// AddPropertyDropdown.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import ListingOptionModal from "./ListingOptionModal";

interface AddPropertyDropdownProps {
  dropdownOpen: boolean;
  setDropdownOpen: (val: boolean) => void;
  modalOpen: boolean;
  setModalOpen: (val: boolean) => void;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | null;
  setPropertyType: (type: "RESIDENTIAL" | "COMMERCIAL") => void;
}

export default function AddPropertyDropdown({
  dropdownOpen,
  setDropdownOpen,
  modalOpen,
  setModalOpen,
  propertyType,
  setPropertyType,
}: AddPropertyDropdownProps) {
  const dispatch = useDispatch();
  const handleOpenModal = (type: "RESIDENTIAL" | "COMMERCIAL") => {
    setPropertyType(type);
    setDropdownOpen(false);
    setModalOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-md mr-1 sm:bg-primary text-primary hover:bg-primary hover:text-primary-foreground sm:text-primary-foreground font-normal"
            size="sm"
          >
            <PlusIcon className="hidden sm:block" />
            Add Your Property <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-fit rounded-xl rounded-tr-none shadow-[0px_8px_32px_rgba(0,0,0,0.12)] bg-background p-0 text-sm text-muted"
        >
          <DropdownMenuItem asChild className="px-4 py-3 hover:text-foreground transition-colors">
            <Button
              variant="ghost"
              onClick={() => handleOpenModal("RESIDENTIAL")}
              className="w-full rounded-none"
            >
              Residential
            </Button>
          </DropdownMenuItem>
          <div className="border-t border-gray-200 mx-3" />
          <DropdownMenuItem asChild className="px-4 py-3 hover:text-foreground transition-colors">
            <Button
              variant="ghost"
              onClick={() => handleOpenModal("COMMERCIAL")}
              className="w-full rounded-none"
            >
              Commercial
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ListingOptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        propertyType={propertyType}
      />
    </>
  );
}
