import { isFunction } from 'lodash';
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import useUpdateEffect from '../useUpdateEffect';
import { isUndef } from '../utils';

export interface IFuncUpdater<T> {
  (previousState?): T;
}

export interface Options<T> {
  defaultValue: T | IFuncUpdater<T>;
}

export const createUseStorageState = (getStorage: () => Storage | undefined) => {
  return function useStorageState<T>(key: string, options?: Options<T>) {
    let storage: Storage | undefined;

    try {
      storage = getStorage();
    } catch (err) {
      console.error(err);
    }

    const serializer = (value: T) => {
      return JSON.stringify(value);
    };

    const deserializer = (value: string) => {
      return JSON.parse(value);
    };

    const getStoredValue = () => {
      try {
        const raw = storage?.getItem(key);
        if (raw) {
          return deserializer(raw);
        }
        if (isFunction(options?.defaultValue)) {
          return options?.defaultValue();
        } else {
          return options?.defaultValue;
        }
      } catch (err) {
        console.error(err);
      }
    };

    const [state, setState] = useState<T | undefined>(() => getStoredValue());

    useUpdateEffect(() => {
      setState(getStoredValue());
    }, [key]);

    const updateState = (value: T | IFuncUpdater<T>) => {
      if (isUndef(value)) {
        setState(value);
        storage?.removeItem(key);
      } else if (isFunction(value)) {
        const currentState = value(state);
        try {
          setState(currentState);
          storage?.setItem(key, serializer(currentState));
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          setState(value);
          storage?.setItem(key, serializer(value));
        } catch (err) {
          console.error(err);
        }
      }
    };

    return [state, useMemoizedFn(updateState)] as const;
  };
};
