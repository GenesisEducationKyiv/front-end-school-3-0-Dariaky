import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'page-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Whoooops! Page not found!</h1>
  `,
  styles: [`
    h1 {
      margin: 24px;
    }
  `]
})

export class PageNotFoundComponent {}
