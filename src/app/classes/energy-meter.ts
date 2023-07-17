import {MeterReading} from "../models/meter-reading";

export class EnergyMeter {
  private net_import: number = 0;
  private net_export: number = 0;
  private import_balance: number = 0;
  private export_balance: number = 0;
  private readonly import_tariff: number;
  private readonly export_tariff: number;

  public get ImportTariff() {
    return this.import_tariff;
  }
  public get ExportTariff() {
    return this.export_tariff;
  }

  public get NetImport() { return this.net_import }
  public get NetExport() { return this.net_export }
  public get ImportBalance() { return this.import_balance }
  public get ExportBalance() { return this.export_balance }

  /**
   * @param importTariff The unit cost of import (kWh)
   * @param exportTariff The unit cost of export (kWh)
   */
  constructor (importTariff: number, exportTariff: number) {
    this.import_tariff = importTariff;
    this.export_tariff = exportTariff;
  }

  /**
   * Takes a snapshot of the net import/export values
   */
  public GetMeterReading(): MeterReading {
    return {
      Import: this.net_import,
      Export: this.net_export,
      Date: new Date()
    };
  }

  /**
   * Imports energy from the grid
   * @param power The amount of power to import (kWh)
   */
  public ImportEnergy(power: number) {
    this.net_import += power;
    this.import_balance += power * this.import_tariff;
  }
  /**
   * Exports energy to the grid
   * @param power The amount of power to export (kWh)
   */
  public ExportEnergy(power: number) {
    this.net_export += power;
    this.export_balance += power * this.export_tariff;
  }
}
