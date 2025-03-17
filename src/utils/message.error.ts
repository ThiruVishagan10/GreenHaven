import { ZodError } from "zod";
export const getErrorMessage = (error: unknown): string => {
  let message: string 
  if (error instanceof ZodError) {
    message = error.issues.map((issue) => issue.message).join(", ")
  } else if (error instanceof Error) {
    message = error.message
  } else if (typeof error === "string") {
    message = error
  } else {
    message = "Unknown error"
  }
  return message;
};