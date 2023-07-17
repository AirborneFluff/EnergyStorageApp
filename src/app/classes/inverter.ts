import {Battery} from "./battery";
import {InverterOutput} from "../models/inverter-output";

export class Inverter {
  private output_power!: number;
  private battery!: Battery;
  private readonly charge_efficiency: number = 0.95;
  private readonly discharge_efficiency: number = 0.95;

  constructor (outputPower: number, battery: Battery, chargeEfficiency?: number, dischargeEfficiency?: number) {
    this.output_power = outputPower;
    this.battery = battery;
    if (chargeEfficiency) this.charge_efficiency = chargeEfficiency;
    if (dischargeEfficiency) this.discharge_efficiency = dischargeEfficiency;
  }

  public ApplyPower(importPower: number, exportPower: number): InverterOutput {

    const exportPotential = exportPower * this.charge_efficiency;
    const importPotential = importPower * this.discharge_efficiency;

    if (exportPotential > 0)
    {
      const unusedPower = this.battery.AddCharge(exportPotential); // If the battery is full, we will have some unused power to export
      exportPower = unusedPower / this.charge_efficiency; // Return the unused to before efficiency sum
    }
    if (importPotential > 0)
    {
      const requiredPower = this.battery.RemoveCharge(importPotential); // If the battery is empty, we will need to import some power
      importPower = requiredPower / this.discharge_efficiency; // Return the unused to before efficiency sum
    }

    return {
      VirtualImport: importPower,
      VirtualExport: exportPower
    }
  }

  public GetBatteryChargeLevel(): number {
    return this.battery.ChargeLevel;
  }
}
