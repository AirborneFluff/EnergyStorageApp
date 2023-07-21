import { Injectable } from '@angular/core';
import {Consumption} from "../models/consumption";
import {Observable} from "rxjs";
import {EnergyStorageSystem} from "../classes/energy-storage-system";
import {StorageSystemParameters} from "../models/storage-system-parameters";
import essData from '../data/energy-storage-systems.json'

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  public Priority: number | undefined = undefined;
  public ImportTariff: number = 0.3;
  public ExportTariff: number = 0.1;
  importData: Consumption[] = [];
  exportData: Consumption[] = [];
  constructor() {}

  public GenerateSystems(): EnergyStorageSystem[] {
    let systems: EnergyStorageSystem[] = [];
    for (let i = 0; i < essData.Systems.length; i++) {
      const params: Partial<StorageSystemParameters> = essData.Systems[i];
      params.ImportTariff = this.ImportTariff;
      params.ExportTariff = this.ExportTariff;
      systems.push(new EnergyStorageSystem(params as StorageSystemParameters))
    }
    return systems;
  }

  public parseConsumptionFile(file: File): Observable<any> {
    let fileReader = new FileReader();

    return new Observable((observer) => {
      fileReader.onload = () => {
        const fileString = fileReader.result as string;
        const data = this.parseConsumptionData(fileString);
        observer.next(data);
        observer.complete();
      }
      fileReader.readAsText(file);
    });
  }

  private parseConsumptionData(csvString: string): Consumption[] {
    const csvData: Consumption[] = [];

    const lines = csvString.split('\n');

    for (let i = 1; i < lines.length; i++) {
      const values: string[] = lines[i].split(',');
      const consumption = Number.parseFloat(values[0]) ?? 0;
      const startTimestamp = Date.parse(values[1]?.trim());
      const endTimestamp = Date.parse(values[2]?.trim());
      if (isNaN(consumption) || isNaN(startTimestamp) || isNaN(endTimestamp)) continue;
      csvData.push({
        Consumption: consumption,
        Start: new Date(startTimestamp),
        End: new Date(endTimestamp)
      });
    }
    return csvData;
  }
}
