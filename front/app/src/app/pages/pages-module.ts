import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing-module';
import { DashboardComponent } from './dashboard/dashboard';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class PagesModule { }
