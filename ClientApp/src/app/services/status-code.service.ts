import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusCodeService {
  private statusCode = 200;

  constructor() { }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
  }

  getStatusCode() {
    return this.statusCode;
  }
}
