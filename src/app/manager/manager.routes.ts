import { Routes } from '@angular/router';
import { ParkinglotComponent } from './parkinglot/parkinglot.component';
import { ManagerComponent } from './manager.component';

export const ManagerRoutes: Routes = [
 {
  path: '',
  component: ManagerComponent,
  children:
  [
    {
      path: '',
      loadComponent: () => import('./parkinglot/parkinglot.component').then(m => m.ParkinglotComponent),
    },
    {
      path: 'parkingmap',
      loadComponent: () => import('./parkingmap/parkingmap.component').then(m => m.ParkingmapComponent),
    },
    {
      path: 'parkinglot/:id',
      loadComponent: () => import('./parkinglot/parkinglot-detail/parkinglot-detail.component').then(m => m.ParkinglotDetailComponent),
    },
    {
      path: 'chargestation',
      loadComponent: () => import('./chargestation/chargestation.component').then(m => m.ChargestationComponent),
    },
    {
      path: 'users',
      loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    }

  ]
 }
];
