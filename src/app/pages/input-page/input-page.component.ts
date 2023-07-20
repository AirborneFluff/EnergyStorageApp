import {Component, HostListener} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {SetupService} from "../../services/setup.service";

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css'],
  animations: [
    trigger('flyInOut', [
      transition("void => left", [
        style({ transform: "translateX(100%) translateY(-100%)"}),
        animate("250ms ease-out",
          style({ transform: "translateX(0) translateY(-100%)"})
        )]),
      transition("left => void", [
        style({ transform: "translateX(0)"}),
        animate(
          "250ms ease-out",
          style({ transform: "translateX(-30%)"})
        )
      ]),
      transition("void => right", [
        style({ transform: "translateX(-30%)"}),
        animate("250ms ease-out",
          style({ transform: "translateX(0)"})
        )]),
      transition("right => void", [
        style({ transform: "translateX(0) translateY(-100%)"}),
        animate(
          "250ms ease-out",
          style({ transform: "translateX(100%) translateY(-100%)"})
        )
      ])
    ])
  ]
})
export class InputPageComponent {
  private _sectionState: number = 0;
  animationState: 'left' | 'right' = 'left';
  importUploaded = false;
  exportUploaded = false;

  public set sectionState(val: number) {
    val > this._sectionState ? this.animationState = 'left' : this.animationState = 'right';
    val <= 0 ? this._sectionState = 0 : this._sectionState = val;
  }
  public get sectionState() { return this._sectionState; }

  constructor(public setup: SetupService) {
    history.pushState(null, window.location.href);
  }

  @HostListener( 'window:popstate', ['$event'])
  onPopState(event: Event): void {
    event.preventDefault();
    history.pushState(null, window.location.href);
    this.sectionState--;
  }
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
