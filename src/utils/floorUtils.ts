export type FloorOption = {
    name: string;
    url: string;
  };
  
export function formatFloorName(name: string): string {
    const match = name.match(/floor(\d+)/i);
    if (match) {
        return `Floor ${match[1]}`;
    }
    return name;
}
  
export function extractFloorOptions(layout: string[]): FloorOption[] {
    return layout.map((url) => {
        const rawName = url.split("/").pop()?.replace(/\.[^/.]+$/, "") || "Unknown";
        const name = formatFloorName(rawName);
        return { name, url };
    });
}
    