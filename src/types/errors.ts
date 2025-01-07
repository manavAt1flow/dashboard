// Types

export type E2bErrorCode = "UNAUTHENTICATED" | "UNAUTHORIZED" | string;

export class E2BError extends Error {
  public code: E2bErrorCode;

  constructor(code: E2bErrorCode, message: string) {
    super(message);
    this.name = "E2BError";
    this.code = code;
  }
}

// Errors

export const UnauthenticatedError = () =>
  new E2BError("UNAUTHENTICATED", "User not authenticated");

export const UnauthorizedError = (message: string) =>
  new E2BError("UNAUTHORIZED", message);

export const InvalidParametersError = (message: string) =>
  new E2BError("INVALID_PARAMETERS", message);
