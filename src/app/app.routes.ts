import { Routes } from '@angular/router';
import { Forgotpassword } from './components/auth/forgotpassword/forgotpassword';
import { Login } from './components/auth/login/login'
import { Registration } from './components/auth/registration/registration';
import { Dashboard } from './components/dashboard/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: Login },

  { path: 'register', component: Registration },

  { path: 'forgot-password', component: Forgotpassword },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: '/login' }
];