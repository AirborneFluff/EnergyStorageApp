import {Component, HostListener, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {SetupService} from "../../services/setup.service";
import {CalculationsService} from "../../services/calculations.service";

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css'],
  animations: [
    trigger('flyInOut', [
      transition("void => left", [
        animate("250ms ease-out",
          style({ transform: "translateX(-100%)"})
        )]),
      transition("left => void", [
        animate(
          "250ms ease-in",
          style({ transform: "translateX(-30%)"})
        )
      ]),
      transition("void => right", [
        style({ transform: "translateX(-30%)"}),
        animate("250ms ease-out",
          style({ transform: "translateX(0)"})
        )]),
      transition("right => void", [
        style({ transform: "translateX(-100%)"}),
        animate(
          "250ms ease-in",
          style({ transform: "translateX(0)"})
        )
      ]),
      transition("void => *", [
        style({ opacity: 0 }),
        animate("250ms ease-out",
          style({ opacity: 1})
        )]),
    ])
  ]
})
export class InputPageComponent implements OnInit {
  currentSection: PageSections = PageSections.Intro;
  animationState: 'left' | 'right' | '' = '';
  animating: boolean = true;

  constructor(public setup: SetupService, public calculation: CalculationsService) {}
  ngOnInit(): void {
    history.replaceState(null, window.location.href)
    history.pushState(null, window.location.href);
  }

  public SetSection(section: PageSections) {
    if (this.animating) return;
    if (section < 0) return;

    switch(this.currentSection) {
      case PageSections.Upload:
        if (!this.calculation.IsDataValid) return;
        break;
      case PageSections.Priority:
        if (this.setup.Priority == undefined) return;
        break;
    }

    section > this.currentSection ? this.animationState = 'left' : this.animationState = 'right';
    setTimeout(() => {
      this.currentSection = section;
      if (section == PageSections.Calculate) this.performCalculation();
    })
  }

  @HostListener( 'window:popstate', ['$event'])
  onPopState(event: Event): void {
    event.preventDefault();
    history.replaceState(null, window.location.href)
    history.pushState(null, window.location.href);
    this.SetSection(this.currentSection - 1);
  }
  onImportFileSelected(event: any) {
    const file = event.target.files[0];
    this.setup.parseConsumptionFile(file).subscribe({
      next: val => {
        this.calculation.ImportData = val;
        localStorage.setItem('importData', JSON.stringify(val));
      }
    })
  }
  onExportFileSelected(event: any) {
    const file = event.target.files[0];
    this.setup.parseConsumptionFile(file).subscribe({
      next: val => {
        this.calculation.ExportData = val;
        localStorage.setItem('exportData', JSON.stringify(val));
      }
    })
  }

  performCalculation() {
    this.calculation.GenerateSystems();
    this.calculation.RunCalculations().subscribe({
      next: val => {
        console.log(val);
      },
      error: e => {
        console.log(e);
      }
    });
    // let results: SimulationResult[] = [];
    // for (let i = 0; i < systems.length; i++) {
    //   results.push(systems[i].CalculateFromData(this.setup.importData, this.setup.exportData));
    // }
    // console.log(results)
  }

  protected readonly PageSections = PageSections;
}

enum PageSections {
  'Intro',
  'Upload',
  'Priority',
  'Tariffs',
  'Calculate'
}
