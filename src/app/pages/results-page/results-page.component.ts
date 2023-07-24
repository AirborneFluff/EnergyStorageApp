import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {SetupService} from "../../services/setup.service";
import {CalculationsService} from "../../services/calculations.service";
import {FlyInOutAnimation} from "../../route-animations";
import {CalculationResults} from "../../models/calculation-results";
import {ChartData, ChartEvent, ChartType} from "chart.js";
import {StorageSystemResults} from "../../models/storage-system-results";

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css'],
  animations: [FlyInOutAnimation]
})
export class ResultsPageComponent {
  results!: CalculationResults;
  currentSystem!: StorageSystemResults;
  menuPos = 1;

  constructor(private router: Router) {
    this.results = this.router?.getCurrentNavigation()?.extras?.state?.['results'];
    if (this.results) {
      localStorage.setItem('results', JSON.stringify(this.results));
      this.currentSystem = this.results.SystemResults[0];
      console.log(this.results)
      return;
    }

    const storedResults = localStorage.getItem('results');
    if (!storedResults) return;
    this.results = JSON.parse(storedResults);
    this.currentSystem = this.results.SystemResults[0];
    console.log(this.results)
  }
  ngOnInit(): void {
    history.replaceState(null, window.location.href)
    history.pushState(null, window.location.href);
  }

  @HostListener( 'window:popstate', ['$event'])
  onPopState(event: Event): void {
    event.preventDefault();
    history.replaceState(null, window.location.href)
    history.pushState(null, window.location.href);
  }

  public get doughnutChartData(): ChartData<'doughnut'> {
    return {
      labels: [
        'Current Savings',
        'Payback Period',
        'Potential Savings',
      ],
      datasets: [
        {data: [this.currentSystem?.CurrentSavings, this.currentSystem?.Price, this.currentSystem?.PotentialSavings]},
      ]
    }
  }
}

