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
    },
    {
      path: 'parkinglot/:id',
      loadComponent: () => import('./parkinglot/parkinglot-detail/parkinglot-detail.component').then(m => m.ParkinglotDetailComponent),
    },
    {
      path:'vehicles',
      loadComponent: () => import('./vehicle/vehicle.component').then(m => m.VehicleComponent),
    },
    {
      path:'user',
      loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
    }
  ]
 }
];
