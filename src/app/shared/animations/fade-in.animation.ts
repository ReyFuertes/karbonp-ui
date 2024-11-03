import { trigger, transition, animate, style } from '@angular/animations';

export const fadeInAnimation = (duration = 200) => [trigger('fadeIn', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate(duration, style({ opacity: 1 }))
  ]),
  transition('* => void', [
    animate(duration, style({ opacity: 0 }))
  ])
])];