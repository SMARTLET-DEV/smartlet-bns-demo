"use client";
import { SearchIcon } from "@/assets/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchInput({
    searchValue,
    onSearchChange,
    onSearchClick,
    placeholderText,
    containerClassName,
}: {
  searchValue: string;
  onSearchChange: (val: string) => void;
  onSearchClick: () => void;
  placeholderText: string;
  containerClassName?: string;
}) {
    return (
        <div className={cn("flex flex-grow items-center gap-2 bg-card px-3 rounded-lg h-full", containerClassName)}>
            <SearchIcon className="w-5 h-5 text-secondary" />
            <Input
                placeholder={placeholderText}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onSearchClick();
                    }
                }}
                className="bg-transparent border-none shadow-none text-secondary text-base sm:text-sm
          placeholder:text-sm sm:placeholder:text-sm
          placeholder:text-muted
          focus-visible:ring-0 truncate overflow-hidden whitespace-nowrap"
            />
        </div>
    );
}
