import { Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./employee/employee.routes').then(m => m.EmployeeRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('./manager/manager.routes').then(m => m.ManagerRoutes),
  },
  {
    path: 'logout',
    component: LogoutComponent,
  }
];
