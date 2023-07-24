import {Component, HostListener, OnInit} from '@angular/core';
import {FlyInOutAnimation} from "../../route-animations";
import {SetupService} from "../../services/setup.service";
import {CalculationsService} from "../../services/calculations.service";
import {delay} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css'],
  animations: [FlyInOutAnimation]
})
export class InputPageComponent implements OnInit {
  currentSection: PageSections = PageSections.Intro;
  animationState: 'left' | 'right' | '' = '';
  animating: boolean = true;

  constructor(public setup: SetupService, public calculation: CalculationsService, private router: Router) {}
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
    const time = new Date();
    this.calculation.GenerateSystems();
    this.calculation.RunCalculations()
      .pipe(delay(new Date(time.getTime() + 1500)))
      .subscribe({
      next: val => {
        this.router.navigate(['results'], { state: { results : val } });
      },
      error: e => {
        console.log(e);
      }
    });
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
