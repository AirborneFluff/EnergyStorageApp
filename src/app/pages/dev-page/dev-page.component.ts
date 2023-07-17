import {Component, OnInit} from '@angular/core';
import {EnergyStorageSystem} from "../../classes/energy-storage-system";
import {StorageSystemParameters} from "../../models/storage-system-parameters";

@Component({
  selector: 'app-dev-page',
  templateUrl: './dev-page.component.html',
  styleUrls: ['./dev-page.component.css']
})
export class DevPageComponent implements OnInit {
  system!: EnergyStorageSystem;
  ngOnInit(): void {
    let params: StorageSystemParameters = {
      BatteryCapacity: 2.24,
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
    console.log(this.system.SimulateFromDate(importData, exportData));
  }
}
