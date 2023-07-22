import {StorageSystemStatus} from "./storage-system-status";

export interface StorageSystemResults {
  Name: string,
  Supplier: string,
  Price: number,
  PaybackYears: number,
  EndStatus: StorageSystemStatus
}
