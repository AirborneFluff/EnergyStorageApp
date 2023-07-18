import {StorageSystemParameters} from "../models/storage-system-parameters";
import {Consumption} from "../models/consumption";
import {EnergyStorageSystem} from "../classes/energy-storage-system";
import {SimulationResult} from "../models/simulation-result";

export class EssTestModule {
  public Run(testData: EssTestData) {
    const system: EnergyStorageSystem = new EnergyStorageSystem(testData.SystemParameters);
    const simulationResult: SimulationResult = system.SimulateFromData(testData.ImportData, testData.ExportData);
    const batteryChargeLevel = roundToDigits(simulationResult.FinalStatus.BatteryChargeLevel, 1);
    const exportReading = roundToDigits(simulationResult.FinalStatus.ExportReading, 1);
    const importReading = roundToDigits(simulationResult.FinalStatus.ImportReading, 1);

    console.log(simulationResult);
    console.log(testData)

    return {
      BatteryChargeLevelSuccess: batteryChargeLevel == roundToDigits(testData.ExpectedBatteryChargeLevel,1),
      ExportSuccess: exportReading == roundToDigits(testData.ExpectedExport,1),
      ImportSuccess: importReading == roundToDigits(testData.ExpectedImport,1),
    }
  }
}

export interface EssTestData {
  SystemParameters: StorageSystemParameters,
  ExpectedImport: number,
  ExpectedExport: number,
  ExpectedBatteryChargeLevel: number,
  ImportData: Consumption[],
  ExportData: Consumption[]
}

function roundToDigits(value: number, digits: number) {
  value = value * Math.pow(10, digits);
  value = Math.round(value);
  value = value / Math.pow(10, digits);
  return value;
}
