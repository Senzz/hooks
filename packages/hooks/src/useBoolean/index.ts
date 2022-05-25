import { useMemo, useState } from 'react';

export interface Methods {
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  set: (bool: boolean) => void;
}

const useBoolean = (val: boolean = false): [boolean, Methods] => {
  const [bool, setBool] = useState<boolean>(val);

  const methods: Methods = useMemo(() => {
    return {
      toggle: () => setBool((curBool) => !curBool),
      setTrue: () => setBool(true),
      setFalse: () => setBool(false),
      set: (setVal) => setBool(!!setVal),
    };
  }, []);

  return [bool, methods];
};

export default useBoolean;
