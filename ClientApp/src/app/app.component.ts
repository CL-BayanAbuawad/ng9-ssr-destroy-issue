import { Component, Injector } from '@angular/core';
import { setAppInjector } from './utils/angular-injector.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ClientApp';
  constructor(public injector: Injector) {
    setAppInjector(injector);
  }
}
