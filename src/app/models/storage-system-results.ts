import {StorageSystemStatus} from "./storage-system-status";

export interface StorageSystemResults {
  Name: string,
  Supplier: string,
  Price: number,
  EndStatus: StorageSystemStatus
}
