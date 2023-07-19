import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css'],
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate(1000,
          style({
            transform: 'translateX(0)',
            opacity: 1
          }))
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0)',
          opacity: 1
        }),
        animate(1000,
          style({
            transform: 'translateX(-5%)',
            opacity: 0
          }))
      ])
    ])
  ]
})
export class InputPageComponent {
  pageState: boolean = true;

}
