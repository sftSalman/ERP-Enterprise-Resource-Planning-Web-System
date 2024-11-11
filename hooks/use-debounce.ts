import { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

export const useDebouncedFuncCall = (functionCall = () => { }, delay = 2000) => {
  return useCallback(
    debounce(() => {
      functionCall();
    }, delay),
    [functionCall, delay]
  );
}

export const useDebounced = (functionCall = () => { }, delay = 2000) => {
  const debouncedCall = useDebouncedFuncCall(functionCall, delay);

  useEffect(() => {
    debouncedCall(); // call debounced dispatch function
    return debouncedCall.cancel; // cleanup the debounced function
  }, []);

  return null;
};
