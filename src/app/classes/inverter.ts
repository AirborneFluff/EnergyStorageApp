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

    const chargePotential = exportPower * this.charge_efficiency;
    const requiredCharge = importPower / this.discharge_efficiency;

    if (chargePotential > 0)
    {
      const unusedPower = this.battery.AddCharge(chargePotential); // If the battery is full, we will have some unused power to export
      exportPower = unusedPower / this.charge_efficiency; // Return the unused to before efficiency sum
    }
    if (requiredCharge > 0)
    {
      const importRequired = this.battery.RemoveCharge(requiredCharge); // If the battery is empty, we will need to import some power
      importPower = importRequired * this.discharge_efficiency; // Return the unused to before efficiency sum
    }

    return {
      VirtualImport: importPower,
      VirtualExport: exportPower
    }
  }
  public GetBattery() {
    return this.battery
  }
}
