import {StorageSystemStatus} from "./storage-system-status";

export interface StorageSystemResults {
  Name: string,
  Supplier: string,
  Price: number,
  PaybackYears: number,
  RemainingLifespanYears: number,
  CurrentSavings: number,
  PotentialSavings: number,
  YearlySavings: number,
  EndStatus: StorageSystemStatus
}
