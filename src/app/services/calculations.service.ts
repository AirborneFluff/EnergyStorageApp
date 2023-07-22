import { Injectable } from '@angular/core';
import {EnergyStorageSystem} from "../classes/energy-storage-system";
import {Consumption, ConsumptionJson} from "../models/consumption";
import {Observable, Subscriber} from "rxjs";
import {CalculationResults} from "../models/calculation-results";
import {StorageSystemResults} from "../models/storage-system-results";
import importSampleData from '../data/import-sample-data.json'
import exportSampleData from '../data/export-sample-data.json'
import essData from "../data/energy-storage-systems.json";
import {StorageSystemParameters} from "../models/storage-system-parameters";

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {
  private _systems: EnergyStorageSystem[] = [];
  private _importData: Consumption[] = [];
  private _exportData: Consumption[] = [];
  private _importTariff: number = 0.3;
  private _exportTariff: number = 0.1;

  private _importUsage: number = 0;
  private _exportUsage: number = 0;

  private get dataLength(): number {
    return this._importData.length == this._exportData.length ? this._importData.length : 0;
  }

  public ClearSystems() {
    this._systems = [];
  }
  public set ImportData(data: Consumption[]) {
    this._importData = data;
  }
  public set ExportData(data: Consumption[]) {
    this._exportData = data;
  }
  public set ImportTariff(tariff: number) {
    this._importTariff = tariff;
  }
  public set ExportTariff(tariff: number) {
    this._exportTariff = tariff;
  }
  public get ImportTariff() {
    return this._importTariff;
  }
  public get ExportTariff() {
    return this._exportTariff;
  }
  public get RealImportUsage() {
    return this._importUsage;
  }
  public get RealExportUsage() {
    return this._exportUsage;
  }
  public get RealImportBalance() {
    return this._importUsage * this._importTariff;
  }
  public get RealExportBalance() {
    return this._exportTariff * this._exportTariff;
  }
  public SetSampleData() {
    this.ImportData = this.parseConsumptionFromJson(importSampleData);
    this.ExportData = this.parseConsumptionFromJson(exportSampleData);
  }
  public get IsImportDataValid() {
    return this._importData.length > 0;
  }
  public get IsExportDataValid() {
    return this._exportData.length > 0;
  }
  public get IsDataValid(): boolean {
    if (!this.IsImportDataValid || !this.IsExportDataValid) return false;
    if (this._importData[0].Start?.getTime() != this._exportData[0].Start?.getTime()) return false;
    if (this._importData[0].End?.getTime() != this._exportData[0].End?.getTime()) return false;
    return this._importData.length == this._exportData.length;
  }
  public get DaysOfData(): number {
    if (!this.IsDataValid) return -1;
    const timeSpan = this._importData[this._importData.length - 1].End?.getTime()  - this._importData[0].Start?.getTime();
    return timeSpan / 86400000; // 86400000 => 1 Day
  }
  public GenerateSystems() {
    for (let i = 0; i < essData.Systems.length; i++) {
      const params: Partial<StorageSystemParameters> = essData.Systems[i];
      params.ImportTariff = this._importTariff;
      params.ExportTariff = this._exportTariff;
      this._systems.push(new EnergyStorageSystem(params as StorageSystemParameters))
    }
  }

  public RunCalculations(): Observable<any> {
    return new Observable((observer: Subscriber<CalculationResults>) => {
      if (!this.IsDataValid) observer.error('Import/Export data is invalid');

      for (let i = 0; i < this.dataLength; i++) {
        this.applyConsumptionValueToSystems(this._importData[i], this._exportData[i]);
        this.updateRealUsage(this._importData[i].Consumption, this._exportData[i].Consumption);
      }

      let systemResults: StorageSystemResults[] = [];
      for (let i = 0; i < this._systems.length; i++) {
        systemResults.push({
          Name: this._systems[i].name,
          Supplier: this._systems[i].supplier,
          Price: this._systems[i].price,
          PaybackYears: this._systems[i].GetPaybackYears(this.DaysOfData, this.RealImportBalance, this.RealExportBalance),
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
  private applyConsumptionValueToSystems(importConsumption: Consumption, exportConsumption: Consumption) {
    for (let i = 0; i < this._systems.length; i++) {
      this._systems[i].ApplyConsumptionValues(importConsumption.Consumption, exportConsumption.Consumption);
    }
  }
  private updateRealUsage(importValue: number, exportValue: number) {
    this._importUsage += importValue;
    this._exportUsage += exportValue;
  }
  private parseConsumptionFromJson(values: ConsumptionJson[]): Consumption[] {
    const csvData: Consumption[] = [];
    for (let i = 0; i < values.length; i++) {
      csvData.push({
        Consumption: values[i].Consumption,
        Start: new Date(values[i].Start),
        End: new Date(values[i].End)
      })
    }
    return csvData;
  }

  constructor() { }
}
