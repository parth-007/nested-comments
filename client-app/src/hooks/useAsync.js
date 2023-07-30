import { useCallback, useEffect, useState } from "react";

// Want to call this function automatically && immidiately
export function useAsync(func, dependencies = []) {
    // state here is using rest operator and contains value: [isLoading, error, value];
    const { execute, ...state } = useAsyncInternal(func, dependencies);

    useEffect(() => {
        execute();
    }, [execute]);

    return state;
}

// Want to call this function when we want to
export function useAsyncFn(func, dependencies = []) {
    return useAsyncInternal(func, dependencies, false);
}

function useAsyncInternal(func, dependencies, initialLoading = false) {
    const [isLoading, setIsLoading] = useState(initialLoading);
    const [error, setError] = useState();
    const [value, setValue] = useState();

    const execute = useCallback((...params) => {
        setIsLoading(true);

        return func(...params).then(data => {
            setValue(data);
            setError(undefined);
            return data;
        }).catch(err => {
            setValue(undefined);
            setError(err);
            return Promise.reject(err);
        }).finally(() => {
            setIsLoading(false);
        })
    }, dependencies);

    return { isLoading, error, value, execute };
}