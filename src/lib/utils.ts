import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @param {Record<string, string>} queryParams - Additional query parameters to be added to the redirect URL.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
  queryParams?: Record<string, string>,
) {
  const queryString = new URLSearchParams();
  queryString.set(type, encodeURIComponent(message));
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      queryString.set(key, value);
    });
  }
  return redirect(`${path}?${queryString.toString()}`);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates an exponential smoothing easing function for Framer Motion animations.
 * This implements exponential smoothing as described in https://lisyarus.github.io/blog/posts/exponential-smoothing.html
 * where the position approaches the target value smoothly with a speed factor.
 * @param {number} speed - The speed factor that determines how quickly the value approaches the target (default: 10)
 * @returns {(t: number) => number} An easing function that takes a progress value between 0 and 1 and returns a smoothed value
 */
export const exponential =
  (speed: number = 10) =>
  (t: number): number => {
    // For Framer Motion, we want to map t from [0,1] to a smoothed value
    // Using exponential smoothing formula: 1 - exp(-speed * t)
    return 1 - Math.exp(-speed * t);
  };
