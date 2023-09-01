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

function restArguments<T extends (...args: any[]) => any>(func: T) {
    let startIndex = func.length - 1;
    return function () {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;
        for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
        }
        switch (startIndex) {
            case 0: return func.call(this, rest);
            case 1: return func.call(this, arguments[0], rest);
            case 2: return func.call(this, arguments[0], arguments[1], rest);
        }
        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
    };
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean) {
    let timeout: number, previous: number;
    let result: T;
    let args: IArguments;

    const later = function () {
        var passed = now() - previous;
        if (wait > passed) {
            timeout = setTimeout(later, wait - passed);
        } else {
            timeout = null;
            if (!immediate) result = func(args);

            if (!timeout) args = null;
        }
    };

    let debounced = restArguments(function (_args) {
        args = _args;
        previous = now();
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func(args);
        }
        return result;
    });

    return debounced;
}