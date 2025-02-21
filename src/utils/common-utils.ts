export const debounce = (fn: (...args: unknown[]) => void, delay: number) => {
    let timer: number;
    return function (...args: unknown[]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}