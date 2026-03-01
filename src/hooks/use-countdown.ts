import { useState, useEffect } from "react";

export function useCountdown(initialTime: number = 60) {
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return { timer, setTimer };
}
