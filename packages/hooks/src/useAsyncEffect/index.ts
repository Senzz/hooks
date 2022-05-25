import type { DependencyList } from 'react';
import { useEffect } from 'react';
import { isFunction } from '../utils';

const useAsyncEffect = (effect: () => AsyncGenerator | Promise<void>, deps?: DependencyList) => {
  useEffect(() => {
    function isAsyncGenerator(val: AsyncGenerator | Promise<void>): val is AsyncGenerator {
      return isFunction(val[Symbol.asyncIterator]);
    }

    const e = effect();
    let isCanceled = false;
    const execute = async () => {
      if (isAsyncGenerator(e)) {
        while (true) {
          const result = await e.next();
          if (result.done || isCanceled) {
            break;
          }
        }
      } else {
        await e;
      }
    };
    execute();
    return () => {
      isCanceled = true;
    };
  }, deps);
};

export default useAsyncEffect;
