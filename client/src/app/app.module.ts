import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {MachineListComponent} from './machines/machine-list.component';
import {MachineListService} from './machines/machine-list.service';

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatOptionModule,
    MatSelectModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    MachineListComponent
  ],
  providers: [
    MachineListService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],

  bootstrap: [AppComponent]
})

export class AppModule {
}
