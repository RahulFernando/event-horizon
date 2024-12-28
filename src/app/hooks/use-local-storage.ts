import { useCallback, useState } from "react";

// handle initial value
const getStoredValue = <T>(key: string, val: T) => {
  try {
    if (typeof window === "undefined") return val;

    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : val;
  } catch (error) {
    console.error(error);
    return val;
  }
};

const useLocalStorage = <T>(key: string, initialVal?: T) => {
  const [storedVal, setStoredVal] = useState(getStoredValue(key, initialVal));

  const storeValueHandler = useCallback(
    (value: T | (() => T)) => {
      setStoredVal(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    },
    [key]
  );

  const removeStoredValueHandler = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
      setStoredVal(undefined);
    }
  }, [key]);

  const removeStoredValueByKeyHandler = useCallback(
    (id: string) => {
      if (typeof window !== "undefined") {
        const updatedVal = (storedVal as unknown as { id: string }[]).filter(
          (item) => item.id !== id
        );
        setStoredVal(updatedVal);
        window.localStorage.setItem(key, JSON.stringify(updatedVal));
      }
    },
    [key, storedVal]
  );

  return [
    storedVal,
    storeValueHandler,
    removeStoredValueHandler,
    removeStoredValueByKeyHandler,
  ];
};

export default useLocalStorage;
