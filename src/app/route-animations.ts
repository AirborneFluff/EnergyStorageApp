import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
} from '@angular/animations';

export const routerAnimations =
  trigger('routeAnimations', [
    transition('welcomePage => uploadPage', slideTo('right')),
    transition('uploadPage => tariffPage', slideTo('right')),
    transition('tariffPage => priorityPage', slideTo('right')),
    transition('priorityPage => simulatePage', slideTo('right')),
    transition('simulatePage => resultPage', slideTo('right')),
    transition('* <=> *', fader()),
    //transition('isRight => fader', slideTo('left') ),
    //transition('isLeft => *', slideTo('right') ),
  ]);

// @ts-ignore
function slideTo(direction) {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ], optional),
    group([
      query(':leave', [
        animate('200ms ease-out', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('200ms ease-out', style({ [direction]: '0%'}))
      ], optional)
    ]),
    // Normalize the page style... Might not be necessary

    // Required only if you have child animations on the page
    //query(':leave', animateChild()),
    //query(':enter', animateChild()),
  ];
}

function fader() {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
      }),
    ], optional),
    // Animate the new page in
    query(':enter', [
      animate('400ms ease', style({ opacity: 1 })),
    ], optional),

    //query(':leave', animateChild()),
    //query(':enter', animateChild()),
  ]
}
