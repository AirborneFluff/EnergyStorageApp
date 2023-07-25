import {Inverter} from "./inverter";
import {EnergyMeter} from "./energy-meter";
import {StorageSystemParameters} from "../models/storage-system-parameters";
import {Battery} from "./battery";
import {StorageSystemStatus} from "../models/storage-system-status";
import {StorageSystemResults} from "../models/storage-system-results";

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

  private GetPaybackYears(appliedDays: number, realCost: number): number {
    return this.price / this.GetYearlySavings(appliedDays, realCost);
  }
  private GetYearlySavings(appliedDays: number, realCost: number) {
    const currentSavings = this.GetCurrentSavings(realCost);
    return (365/appliedDays) * currentSavings;
  }
  private GetCurrentSavings(realCost: number): number {
    const virtualCost = this.energy_meter.ImportBalance - this.energy_meter.ExportBalance;
    return realCost - virtualCost;
  }
  private GetPotentialSavings(realCost: number): number {
    // const currentSavings = this.GetCurrentSavings(realImportBalance, realExportBalance);
    // const batteryHealth = this.inverter.GetBattery().Health;

    const currentSavings = this.GetCurrentSavings(realCost);
    return currentSavings / this.inverter.GetBattery().CurrentCycleUsage;
  }
  private GetRemainingLifespanYear(appliedDays: number): number {
    const currentYearsApplied = appliedDays/365;
    const cyclesPerYear = this.inverter.GetBattery().CyclesUsed / currentYearsApplied;
    return this.inverter.GetBattery().RemainingCycles / cyclesPerYear;
  }

  public GetCalculationResults(appliedDays: number, realCost: number): StorageSystemResults {
    return {
      Name: this.name,
      Price: this.price,
      Supplier: this.supplier,
      EndStatus: this.GetStatus(),
      CurrentSavings: this.GetCurrentSavings(realCost),
      RemainingLifespanYears: this.GetRemainingLifespanYear(appliedDays),
      PaybackYears: this.GetPaybackYears(appliedDays, realCost),
      PotentialSavings: this.GetPotentialSavings(realCost),
      YearlySavings: this.GetYearlySavings(appliedDays, realCost)
    }
  }

  public GetStatus(): StorageSystemStatus {
    return {
      BatteryChargeLevel: this.inverter.GetBattery().ChargeLevel,
      BatteryHealth: this.inverter.GetBattery().Health,
      BatteryRemainingCycles: this.inverter.GetBattery().RemainingCycles,
      BatteryUsableCapacity: this.inverter.GetBattery().UsableCapacity,
      TotalStoredEnergy: this.inverter.GetBattery().TotalEnergyStored,
      ExportBalance: this.energy_meter.ExportBalance,
      ExportReading: this.energy_meter.NetExport,
      ImportBalance: this.energy_meter.ImportBalance,
      ImportReading: this.energy_meter.NetImport
    }
  }
}
