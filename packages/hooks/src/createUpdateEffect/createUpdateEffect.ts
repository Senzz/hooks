import type { useEffect, useLayoutEffect } from 'react';
import { useRef } from 'react';

type effectHookType = typeof useEffect | typeof useLayoutEffect;

type TypeFn = (hook: effectHookType) => effectHookType;

export const createUpdateEffect: TypeFn = (hook) => {
  return (effect, deps?) => {
    const isMounted = useRef(false);

    // for re-render
    hook(() => {
      isMounted.current = true;
    }, []);

    hook(() => {
      return () => {
        if (isMounted.current) {
          effect();
        }
      };
    }, deps);
  };
};
