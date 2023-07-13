import { Component } from '@angular/core';

@Component({
  selector: 'app-tariff-page',
  templateUrl: './tariff-page.component.html',
  styleUrls: ['./tariff-page.component.css']
})
export class TariffPageComponent {
  importTariff = 0.295;
  exportTariff = 0.125;

}
