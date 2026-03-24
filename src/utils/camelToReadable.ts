export function camelToReadable(input: string): string {
    if (!input) return "";

    // Detect camelCase or PascalCase
    if (/[a-z][A-Z]/.test(input)) {
        const spaced = input
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .trim();

        const words = spaced.split(" ").map((word) => {
            // Special case: always make "Cctv" → "CCTV"
            if (word.toLowerCase() === "cctv") return "CCTV";
            // Capitalize first letter, keep rest as-is
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

        return words.join(" ");
    }

    // Otherwise treat as a normal sentence — capitalize each word smartly
    return input
        .split(" ")
        .filter(Boolean)
        .map((word) => {
            if (word.toLowerCase() === "cctv") return "CCTV"; // handle CCTV
            if (word === word.toUpperCase()) return word; // keep acronyms
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}
