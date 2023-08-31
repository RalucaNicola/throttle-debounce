export const now = Date.now || function () {
    return new Date().getTime();
};

interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}


export function throttle<T extends (...args: any[]) => any>(func: T, wait: number, options?: ThrottleOptions): (...args: Parameters<T>) => T {
    let timeout: number | undefined;
    let result: T;
    let args: IArguments;
    let previous = 0;
    if (!options) options = {}

    const later = function () {
        previous = options.leading === false ? 0 : now();
        timeout = null;
        result = func(args);
        if (!timeout) args = null;
    };

    const throttled = function () {
        const _now = now();
        if (!previous && options.leading === false) previous = _now;
        var remaining = wait - (_now - previous);
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = _now;
            result = func(...args);
            if (!timeout) args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    return throttled;
}