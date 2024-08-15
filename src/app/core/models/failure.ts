import { FailureType } from "../enums/failure-type";

export interface Failure {
  id?: number;
  description: string;
  type: FailureType;
}