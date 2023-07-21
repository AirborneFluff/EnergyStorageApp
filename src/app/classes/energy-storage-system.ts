import {Inverter} from "./inverter";
import {EnergyMeter} from "./energy-meter";
import {StorageSystemParameters} from "../models/storage-system-parameters";
import {Battery} from "./battery";
import {StorageSystemStatus} from "../models/storage-system-status";
import {Consumption} from "../models/consumption";

export class EnergyStorageSystem {
  private inverter!: Inverter;
  private energy_meter!: EnergyMeter;
  private real_meter!: EnergyMeter;
  public readonly name!: string;
  public readonly supplier!: string;
  public readonly price!: number;

  constructor (params: StorageSystemParameters) {
    const battery = new Battery(params.BatteryNominalCapacity, params.BatteryCapacity, params.BatteryCycleLife);
    this.inverter = new Inverter(params.InverterOutputPower, battery, params.InverterChargeEfficiency, params.InverterDischargeEfficiency);
    this.energy_meter = new EnergyMeter(params.ImportTariff, params.ExportTariff);
    this.real_meter = new EnergyMeter(params.ImportTariff, params.ExportTariff);
    this.name = params.Name;
    this.supplier = params.Name;
    this.price = params.Price;
  }

  public ApplyConsumptionValues(importConsumption: number, exportConsumption: number): StorageSystemStatus {
    const virtualValues = this.inverter.ApplyPower(importConsumption, exportConsumption);
    this.energy_meter.ImportEnergy(virtualValues.VirtualImport);
    this.energy_meter.ExportEnergy(virtualValues.VirtualExport);
    this.real_meter.ImportEnergy(importConsumption);
    this.real_meter.ExportEnergy(exportConsumption);
    return this.GetStatus();
  }

  public CalculateFromData(importData: Consumption[], exportData: Consumption[]): any {
    for (let i = 0; i < importData.length; i++) {
      if (!exportData[i]) break;
      this.ApplyConsumptionValues(importData[i].Consumption, exportData[i].Consumption);
    }
    const timeSimulated = importData[importData.length - 1].End?.getTime()  - importData[0].Start?.getTime()
    const daysSimulated = timeSimulated / 86400000; // 86400000 => 1 Day
    const finalStatus = this.GetStatus();
    return {
      DaysSimulated : daysSimulated,
      FinalStatus : finalStatus,
      BatteryUsableCapacity: this.inverter.GetBattery().UsableCapacity,
      BatteryRemainingCycles: this.inverter.GetBattery().RemainingCycles,
      BatteryHealth: finalStatus.BatteryHealth,
      PaybackYears: this.GetPaybackYears(daysSimulated)
    }
  }

  public GetPaybackYears(simulationDays: number): number | null {
    const realCost = this.real_meter.ImportBalance - this.real_meter.ExportBalance;
    const virtualCost = this.energy_meter.ImportBalance - this.energy_meter.ExportBalance;
    const benefit = realCost - virtualCost;
    console.log((365/simulationDays) * benefit)
    console.log(this.price)

    if (benefit <= 0) return null;

    return this.price / ((365/simulationDays) * benefit)
  }

  public GetStatus(): StorageSystemStatus {
    return {
      BatteryChargeLevel: this.inverter.GetBattery().ChargeLevel,
      BatteryHealth: this.inverter.GetBattery().Health,
      Date: new Date(),
      ExportBalance: this.energy_meter.ExportBalance,
      ExportReading: this.energy_meter.NetExport,
      ImportBalance: this.energy_meter.ImportBalance,
      ImportReading: this.energy_meter.NetImport
    }
  }
}
