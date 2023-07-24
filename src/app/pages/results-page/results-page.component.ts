import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {FlyInOutAnimation} from "../../route-animations";
import {CalculationResults} from "../../models/calculation-results";
import {ChartConfiguration, ChartData} from "chart.js";
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
    const low = this.currentSystem?.CurrentSavings;
    const mid = this.currentSystem?.Price - low;
    const total = this.currentSystem?.PotentialSavings - mid;
    return {
      labels: [
        'Current Savings',
        'Payback Period',
        'Potential Savings',
      ],
      datasets: [
        { data: [low, mid, total],
          backgroundColor: [
            '#005777',
            '#00adee',
            '#80d6f7'
          ]
        },
      ]
    }
  }

  public doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '75%',

  };
}

