import {Component, OnInit} from '@angular/core';
import {StorageSystemParameters} from "../../models/storage-system-parameters";
import {EnergyStorageSystem} from "../../classes/energy-storage-system";
import {SetupService} from "../../services/setup.service";

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})
export class LoadingPageComponent implements OnInit {
  system!: EnergyStorageSystem;
  private _setup: SetupService;

  constructor(setup: SetupService) {
    this._setup = setup;
  }
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
    console.log(this.system.SimulateFromData(this._setup.importData, this._setup.exportData));
  }


}
