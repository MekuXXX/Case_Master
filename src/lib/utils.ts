import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param arr
 * @param parts
 * @returns
 *
 * Split array with parts user use
 */
export function splitArrayWithParts<T>(arr: Array<T>, parts: number) {
  const result: Array<Array<T>> = [];
  const sliceLen = Math.floor(arr.length / parts);
  let start = 0;

  for (let i = 0; i < parts; ++i) {
    result.push(arr.slice(start, start + sliceLen));
    start += sliceLen;
  }

  return result;
}

/**
 *
 * @param arr
 * @param partsLength
 * @returns
 *
 * Split array with length of each part
 */
export function splitArrayWithLength<T>(arr: Array<T>, partsLength: number) {
  const parts = Math.floor(arr.length / partsLength);
  return splitArrayWithLength(arr, parts);
}
