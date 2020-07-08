import { Injector, ElementRef } from '@angular/core';
import { appInjector } from '../utils/angular-injector.utils';
import { StatusCodeService } from '../services/status-code.service';

export class BasePageComponent {
  protected statusCodeService: StatusCodeService;
  constructor(protected statusCode: number) {
    this.statusCodeService = appInjector.get(StatusCodeService);
    this.statusCodeService.setStatusCode(statusCode);
  }
}
