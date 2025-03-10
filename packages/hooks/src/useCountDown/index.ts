import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

export type TDate = Date | string | number | undefined;
export interface Options {
  targetDate?: TDate;
  interval?: number;
  onEnd?: () => void;
}

export interface FormattedRes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const calcLeft = (t: TDate) => {
  if (!t) return 0;
  let left = dayjs(t).valueOf() - new Date().getTime();
  if (left < 0) {
    left = 0;
  }
  return left;
};

const parseMs = (milliseconds: number): FormattedRes => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  };
};

const useCountdown = (options?: Options): [number, FormattedRes] => {
  const { targetDate, interval = 1000, onEnd } = options || {};
  const [countdown, setCountdown] = useState(() => calcLeft(targetDate));

  useEffect(() => {
    if (!targetDate) {
      // for stop
      setCountdown(0);
      return;
    }

    setCountdown(calcLeft(targetDate));

    const timer: NodeJS.Timer = setInterval(() => {
      const left = calcLeft(targetDate);
      setCountdown(left);
      if (left === 0) {
        clearInterval(timer);
        if (onEnd) {
          onEnd();
        }
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [targetDate, interval]);

  const formattedRes = useMemo(() => {
    return parseMs(countdown);
  }, [countdown]);

  return [countdown, formattedRes];
};

export default useCountdown;
