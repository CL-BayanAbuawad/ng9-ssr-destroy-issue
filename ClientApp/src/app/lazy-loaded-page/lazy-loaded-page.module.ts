import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyLoadedPageRoutingModule } from './lazy-loaded-page-routing.module';
import { LazyLoadedPageComponent } from './lazy-loaded-page.component';


@NgModule({
  declarations: [LazyLoadedPageComponent],
  imports: [
    CommonModule,
    LazyLoadedPageRoutingModule
  ]
})
export class LazyLoadedPageModule { }
