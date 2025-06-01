import {Component} from '@angular/core';

@Component({
  selector: 'page-not-found',
  standalone: true,
  template: `
    <h1>Whoooops! Page not found!</h1>
  `,
  styles: [`
    h1 {
      margin: 24px;
    }
  `]
})

export class PageNotFoundComponent  {}
