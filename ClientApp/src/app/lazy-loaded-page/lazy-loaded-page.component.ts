import { Component } from '@angular/core';
import { BasePageComponent } from '../components/page-base.component';

@Component({
  selector: 'app-lazy-loaded-page',
  templateUrl: './lazy-loaded-page.component.html',
  styleUrls: ['./lazy-loaded-page.component.scss']
})
export class LazyLoadedPageComponent extends BasePageComponent {
  constructor() {
    super(400);
  }
}
