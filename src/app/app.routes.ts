import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { ProductTableComponent } from './components/product-table/product-table.component';

export const routes: Routes = [
    {
       path: "dashboard",
       component: DashboardComponent,
       title: 'IoT Dashboard - Home',
    },
    {
        path: "prodotti",
       component: ProductTableComponent,
       title: 'IoT Dashboard - Prodotti',
    },

    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }
];
