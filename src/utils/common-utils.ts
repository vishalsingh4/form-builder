export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return function (...args: unknown[]) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}