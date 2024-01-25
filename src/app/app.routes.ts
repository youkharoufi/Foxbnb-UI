import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { ChatComponent } from './Chat/chat.component';

export const routes: Routes = [
  {path:'', component:IndexComponent},
  {path:'property-list', component:PropertyListComponent},
  {path:'property-details/:propertyId', component:PropertyDetailsComponent},
  {path:'chat/:ownerId', component:ChatComponent}
];
