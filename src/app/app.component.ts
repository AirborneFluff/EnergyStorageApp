import {Component} from '@angular/core';
import {routerAnimations} from "./route-animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerAnimations]
})
export class AppComponent {
  title = 'client';
}
