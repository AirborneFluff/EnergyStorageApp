import {Inverter} from "./inverter";
import {EnergyMeter} from "./energy-meter";
import {StorageSystemParameters} from "../models/storage-system-parameters";
import {Battery} from "./battery";
import {StorageSystemStatus} from "../models/storage-system-status";
import {Consumption} from "../models/consumption";
import {SimulationResult} from "../models/simulation-result";

export class EnergyStorageSystem {
  private inverter!: Inverter;
  private energy_meter!: EnergyMeter;

  constructor (params: StorageSystemParameters) {
    const battery = new Battery(params.BatteryCapacity);
    this.inverter = new Inverter(params.InverterOutputPower, battery, params.InverterChargeEfficiency, params.InverterDischargeEfficiency);
    this.energy_meter = new EnergyMeter(params.ImportTariff, params.ExportTariff);
  }

  public ApplyConsumptionValues(importConsumption: number, exportConsumption: number): StorageSystemStatus {
    const virtualValues = this.inverter.ApplyPower(importConsumption, exportConsumption);
    this.energy_meter.ImportEnergy(virtualValues.VirtualImport);
    this.energy_meter.ExportEnergy(virtualValues.VirtualExport);
    return this.GetStatus();
  }

  public SimulateFromData(importData: Consumption[], exportData: Consumption[]): SimulationResult {
    for (let i = 0; i < importData.length; i++) {
      if (!importData[i]) continue;
      if (!exportData[i]) continue;
      this.ApplyConsumptionValues(importData[i].Consumption, exportData[i].Consumption);
    }
    const timeSimulated = 0//importData[importData.length - 1].End?.getTime()  - importData[0].Start?.getTime()
    const daysSimulated = timeSimulated / 86400000; // 86400000 => 1 Day
    return {
      DaysSimulated : daysSimulated,
      FinalStatus : this.GetStatus()
    }
  }

  public GetStatus(): StorageSystemStatus {
    return {
      BatteryChargeLevel: this.inverter.GetBatteryChargeLevel(),
      BatteryHealth: 0,
      Date: new Date(),
      ExportBalance: this.energy_meter.ExportBalance,
      ExportReading: this.energy_meter.NetExport,
      ImportBalance: this.energy_meter.ImportBalance,
      ImportReading: this.energy_meter.NetImport
    }
  }
}
