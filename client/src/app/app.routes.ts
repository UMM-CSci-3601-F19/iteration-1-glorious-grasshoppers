// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MachineListComponent} from './machines/machine-list.component';

// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'machines', component: MachineListComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
