"use client";
import { useRef } from "react";
export default function AbortTest() {
  const abortControllerRef = useRef<AbortController | null>(null);
  return (
    <div>
      <button onClick={() => {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        fetch("/api/abortTest", { signal: abortController.signal }).then((res) => {
          console.log(res);
        });
      }}>Fetch</button>
      <button onClick={() => {
        abortControllerRef.current?.abort();
      }}>Cancel</button>
    </div>
  );
}


