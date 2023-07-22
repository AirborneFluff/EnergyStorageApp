import { Injectable } from '@angular/core';
import {Consumption} from "../models/consumption";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  public Priority: number | undefined = undefined;
  constructor() {}

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
