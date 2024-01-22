import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { PropertyListComponent } from './property-list/property-list.component';

export const routes: Routes = [
  {path:'', component:IndexComponent},
  {path:'property-list', component:PropertyListComponent}
];