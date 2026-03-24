// utils/debounce.ts
export const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: any;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
