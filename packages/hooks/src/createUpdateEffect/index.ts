import type { useEffect, useLayoutEffect } from 'react';
import { useRef } from 'react';

type effectHookType = typeof useEffect | typeof useLayoutEffect;

type TypeFn = (hook: effectHookType) => effectHookType;

export const createUpdateEffect: TypeFn = (hook) => {
  return (effect, deps?) => {
    const isMounted = useRef(false);

    // for react-refresh
    hook(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    hook(() => {
      if (!isMounted.current) {
        isMounted.current = true;
      } else {
        return effect();
      }
    }, deps);
  };
};
