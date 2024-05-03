import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';

export const EmployeeRoutes: Routes = [
 {
  path: '',
  component: EmployeeComponent,
  children:
  [
    {
      path: '',
      loadComponent: () => import('./parkinglot/parkinglot.component').then(m => m.ParkinglotComponent),
    }
  ]
 }
];
