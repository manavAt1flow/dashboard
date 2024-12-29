import { TeamWithDefault } from "./dashboard";

interface ErrorResponse {
  type: "error";
  message: string;
}

interface InitResponse {
  type: "success";
  teams: TeamWithDefault[];
}

export type { ErrorResponse, InitResponse };
