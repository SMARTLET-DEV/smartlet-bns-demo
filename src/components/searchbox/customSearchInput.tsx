import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SearchInput } from "./SearchInput";

type CustomSearchInputProps = {
    searchValue: string;
    onSearchChange: (val: string) => void;
    onSearchClick: () => void;
    placeholderText: string;
    isSuggestionVisible: boolean;
    suggestions: string[] | undefined;
    onSuggestionClick?: (val: string) => void;
    setIsSuggestionVisible: (val: boolean) => void;
    containerClassName?: string;
};

export const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
    searchValue,
    onSearchChange,
    onSearchClick,
    placeholderText,
    isSuggestionVisible,
    suggestions,
    onSuggestionClick,
    setIsSuggestionVisible,
    containerClassName,
}) => {
    // Ref for the wrapper div
    const inputRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Set dropdown position after render
    useLayoutEffect(() => {
        if (
            inputRef.current &&
            isSuggestionVisible &&
            suggestions &&
            suggestions.length > 0
        ) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: "absolute",
                left: rect.left + window.scrollX,
                top: rect.bottom + window.scrollY,
                width: rect.width,
                zIndex: 20000,
            });
        }
    }, [isSuggestionVisible, suggestions]);
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes("properties")) {
            setIsSuggestionVisible(false);
        }
    }, [pathname, searchParams, setIsSuggestionVisible]);

    // For server-side rendering safety (Next.js)
    const isClient = typeof window !== "undefined";

    return (
        <>
            <div className="h-full" ref={inputRef}>
                <SearchInput
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    onSearchClick={onSearchClick}
                    placeholderText={placeholderText}
                    containerClassName={containerClassName}
                />
            </div>

            {isClient &&
                isSuggestionVisible &&
                suggestions &&
                suggestions.length > 0 &&
                searchValue.trim() !== "" &&
                createPortal(
                    <ul
                        style={dropdownStyle}
                        className="max-h-60 overflow-y-auto bg-background rounded-b-lg shadow-sm absolute"
                    >
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 cursor-pointer text-sm hover:bg-muted/10 hover:text-primary"
                                onClick={() => {
                                    onSuggestionClick?.(suggestion);
                                    setTimeout(
                                        () => setIsSuggestionVisible(false),
                                        0
                                    );
                                }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>,
                    document.body
                )}
        </>
    );
};

export default CustomSearchInput;
