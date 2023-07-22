import { Injectable } from '@angular/core';
import {EnergyStorageSystem} from "../classes/energy-storage-system";
import {Consumption} from "../models/consumption";
import {Observable, Subscriber} from "rxjs";
import {CalculationResults} from "../models/calculation-results";
import {StorageSystemResults} from "../models/storage-system-results";

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {
  private _systems: EnergyStorageSystem[] = [];
  private _importData: Consumption[] = [];
  private _exportData: Consumption[] = [];

  public ClearSystems() {
    this._systems = [];
  }
  public AddSystem(system: EnergyStorageSystem) {
    this._systems.push(system);
  }
  public set ImportData(data: Consumption[]) {
    this._importData = data;
  }
  public set ExportData(data: Consumption[]) {
    this._exportData = data;
  }
  public get IsImportDataValid() {
    if (this._exportData.length == 0) return this._importData.length > 0;
    return this.IsDataValid;
  }
  public get IsExportDataValid() {
    if (this._importData.length == 0) return this._exportData.length > 0;
    return this.IsDataValid;
  }
  public get IsDataValid(): boolean {
    if (!this.IsImportDataValid || !this.IsExportDataValid) return false;
    if (this._importData[0].Start != this._exportData[0].Start) return false;
    if (this._importData[0].End != this._exportData[0].End) return false;
    return this._importData.length == this._exportData.length;
  }
  public get DaysOfData(): number {
    if (!this.IsDataValid) return -1;
    const timeSpan = this._importData[this._importData.length - 1].End?.getTime()  - this._importData[0].Start?.getTime();
    return timeSpan / 86400000; // 86400000 => 1 Day
  }
  private get DataLength(): number {
    return this._importData.length == this._exportData.length ? this._importData.length : 0;
  }

  public RunCalculations(): Observable<any> {
    return new Observable((observer: Subscriber<CalculationResults>) => {
      if (!this.IsDataValid) observer.error('Import/Export data is invalid');

      for (let i = 0; i < this.DataLength; i++) {
        this.ApplyConsumptionValueToSystems(this._importData[i], this._exportData[i]);
      }

      let systemResults: StorageSystemResults[] = [];
      for (let i = 0; i < this._systems.length; i++) {
        systemResults.push({
          Name: this._systems[i].name,
          Supplier: this._systems[i].supplier,
          Price: this._systems[i].price,
          EndStatus: this._systems[i].GetStatus()
        })
      }

      observer.next({
        DaysCalculated: this.DaysOfData,
        SystemResults: systemResults
      });

      observer.complete();
    })
  }
  private ApplyConsumptionValueToSystems(importConsumption: Consumption, exportConsumption: Consumption) {
    for (let i = 0; i < this._systems.length; i++) {
      this._systems[i].ApplyConsumptionValues(importConsumption.Consumption, exportConsumption.Consumption);
    }
  }

  constructor() { }
}
