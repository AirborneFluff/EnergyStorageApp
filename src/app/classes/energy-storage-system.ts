import {Inverter} from "./inverter";
import {EnergyMeter} from "./energy-meter";
import {StorageSystemParameters} from "../models/storage-system-parameters";
import {Battery} from "./battery";
import {StorageSystemStatus} from "../models/storage-system-status";

export class EnergyStorageSystem {
  private inverter!: Inverter;
  private energy_meter!: EnergyMeter;
  public readonly name!: string;
  public readonly supplier!: string;
  public readonly price!: number;

  constructor (params: StorageSystemParameters) {
    const battery = new Battery(params.BatteryNominalCapacity, params.BatteryCapacity, params.BatteryCycleLife);
    this.inverter = new Inverter(params.InverterOutputPower, battery, params.InverterChargeEfficiency, params.InverterDischargeEfficiency);
    this.energy_meter = new EnergyMeter(params.ImportTariff, params.ExportTariff);
    this.name = params.Name;
    this.supplier = params.Name;
    this.price = params.Price;
  }

  public ApplyConsumptionValues(importConsumption: number, exportConsumption: number) {
    const virtualValues = this.inverter.ApplyPower(importConsumption, exportConsumption);
    this.energy_meter.ImportEnergy(virtualValues.VirtualImport);
    this.energy_meter.ExportEnergy(virtualValues.VirtualExport);
    //return this.GetStatus();
  }

  public GetPaybackYears(appliedDays: number, realImportBalance: number, realExportBalance: number): number {
    const currentSavings = this.GetCurrentSavings(realImportBalance, realExportBalance);
    return this.price / ((365/appliedDays) * currentSavings)
  }

  public GetCurrentSavings(realImportBalance: number, realExportBalance: number): number {
    const realCost = realImportBalance - realExportBalance;
    const virtualCost = this.energy_meter.ImportBalance - this.energy_meter.ExportBalance;
    return realCost - virtualCost;
  }

  public GetPotentialSavings(realImportBalance: number, realExportBalance: number): number {
    // const currentSavings = this.GetCurrentSavings(realImportBalance, realExportBalance);
    // const batteryHealth = this.inverter.GetBattery().Health;

    const currentSavings = this.GetCurrentSavings(realImportBalance, realExportBalance);
    return currentSavings / this.inverter.GetBattery().CurrentCycleUsage;
  }

  public GetStatus(): StorageSystemStatus {
    return {
      BatteryChargeLevel: this.inverter.GetBattery().ChargeLevel,
      BatteryHealth: this.inverter.GetBattery().Health,
      BatteryRemainingCycles: this.inverter.GetBattery().RemainingCycles,
      BatteryUsableCapacity: this.inverter.GetBattery().UsableCapacity,
      ExportBalance: this.energy_meter.ExportBalance,
      ExportReading: this.energy_meter.NetExport,
      ImportBalance: this.energy_meter.ImportBalance,
      ImportReading: this.energy_meter.NetImport
    }
  }
}
