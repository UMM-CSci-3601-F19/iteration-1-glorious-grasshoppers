import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import Backendless from 'backendless';
import { ConnectionsCounterComponent } from './counter/connections-counter.component';
Backendless.initApp(environment.backendless.APP_ID, environment.backendless.API_KEY);

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';
import {environment} from '../environments/environment';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    AddUserComponent,
    ConnectionsCounterComponent
  ],
  providers: [
    UserListService,
    {provide: APP_BASE_HREF, useValue: '/'},
  ],
  entryComponents: [
    AddUserComponent,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
