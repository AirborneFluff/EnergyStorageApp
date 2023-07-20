import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SetupService} from "../../services/setup.service";

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css'],
  animations: [
    trigger('flyInOut', [
      transition(":enter", [
        style({ transform: "translateX(100%) translateY(-100%)", zIndex: 2}),
        animate(
          "250ms ease-out",
          style({ transform: "translateX(0) translateY(-100%)"})
        )
      ]),
      transition(":leave", [
        style({ transform: "translateX(0)", zIndex: 1}),
        animate(
          "250ms ease-out",
          style({ transform: "translateX(-30%)"})
        )
      ])
    ])
  ]
})
export class InputPageComponent {
  sectionState: number = 0;
  importUploaded = false;
  exportUploaded = false;

  constructor(public setup: SetupService) {}
  onImportFileSelected(event: any) {
    const file = event.target.files[0];
    this.setup.parseConsumptionFile(file).subscribe({
      next: val => {
        this.setup.importData = val;
        this.importUploaded = true;
        localStorage.setItem('importData', JSON.stringify(val));
      }
    })
  }

  onExportFileSelected(event: any) {
    const file = event.target.files[0];
    this.setup.parseConsumptionFile(file).subscribe({
      next: val => {
        this.setup.exportData = val;
        this.exportUploaded = true;
        localStorage.setItem('exportData', JSON.stringify(val));
      }
    })
  }
}
