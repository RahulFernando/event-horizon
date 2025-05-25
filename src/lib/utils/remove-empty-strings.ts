/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeEmptyStrings<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj)
    .filter(([_, value]) => value !== "")
    .reduce((acc, [key, value]) => {
      acc[key as keyof T] = value;
      return acc;
    }, {} as Partial<T>);
}

export default removeEmptyStrings;
