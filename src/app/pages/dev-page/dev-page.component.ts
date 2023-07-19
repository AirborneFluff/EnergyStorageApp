import {Component, OnInit} from '@angular/core';
import {EnergyStorageSystem} from "../../classes/energy-storage-system";
import {StorageSystemParameters} from "../../models/storage-system-parameters";
import {EssTestData, EssTestModule} from "../../tests/ess-test";

@Component({
  selector: 'app-dev-page',
  templateUrl: './dev-page.component.html',
  styleUrls: ['./dev-page.component.css']
})
export class DevPageComponent implements OnInit {
  system!: EnergyStorageSystem;
  ngOnInit(): void {
    let params: StorageSystemParameters = {
      BatteryNominalCapacity: 2.4,
      BatteryCapacity: 2.28,
      BatteryCycleLife: 6000,
      ExportTariff: 0.15,
      ImportTariff: 0.295,
      InverterChargeEfficiency: 0.95,
      InverterDischargeEfficiency: 0.95,
      InverterOutputPower: 3
    }
    this.system = new EnergyStorageSystem(params);
    const importRaw = localStorage.getItem('importData');
    const exportRaw = localStorage.getItem('exportData');

    if (!importRaw || !exportRaw) return;

    const importData = JSON.parse(importRaw);
    const exportData = JSON.parse(exportRaw);
    console.log(this.system.CalculateFromData(importData, exportData));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = () => {
      const fileString = fileReader.result as string
      const testData: EssTestData = JSON.parse(fileString);

      let testModule = new EssTestModule();
      console.log(testModule.Run(testData));
    }
    fileReader.readAsText(file);
  }
}
