export function shuffleKeepingIndexFirst<T>(arr: T[], index: number): T[] {
    if (index < 0 || index >= arr.length) return arr;

    const first = arr[index];
    const rest = [...arr.slice(0, index), ...arr.slice(index + 1)];

    // Fisher–Yates shuffle
    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    return [first, ...rest];
}
