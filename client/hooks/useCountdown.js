import { useEffect, useState } from "react";

const targetDate = new Date("2020-12-25T13:37:00");

export default function useCountdown() {
  const [left, setLeft] = useState(targetDate - new Date());

  useEffect(() => {
    const int = setInterval(() => setLeft(targetDate - new Date()), 1000);
    return () => clearInterval(int);
  }, []);

  const seconds = Math.ceil(left / 1000);

  const minutes = Math.ceil(seconds / 60) + (seconds % 60 === 0 ? 1 : 0);
  const hours = Math.ceil(minutes / 60) + (minutes % 60 === 0 ? 1 : 0);

  const pad = (n) => (n < 10 ? "0" : "") + new Number(n).toFixed(0);

  return `
      ${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}
    `;
}
