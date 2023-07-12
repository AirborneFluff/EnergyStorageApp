import { Injectable } from '@angular/core';
import {Consumption} from "../models/Consumption";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  importData: Consumption[] = [];
  exportData: Consumption[] = [];
  constructor() { }

  public parseConsumptionFile(file: File): Observable<any> {
    let fileReader = new FileReader();

    return new Observable((observer) => {
      fileReader.onload = (e) => {
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
      const consumption = Number.parseFloat(values[0]);
      const startDate = new Date(values[1]?.trim());
      const endDate = new Date(values[2]?.trim());

      if (!consumption || !startDate || !endDate) continue;

      csvData.push({
        Consumption: consumption,
        Start: startDate,
        End: endDate
      });
    }

    return csvData;
  }
}
