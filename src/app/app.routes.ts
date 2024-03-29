import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { ChatComponent } from './Chat/chat.component';
import { AllSendersComponent } from './all-senders/all-senders.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {path:'', component:IndexComponent},
  {path:'property-list', component:PropertyListComponent},
  {path:'property-details/:propertyId', component:PropertyDetailsComponent},
  {path:'users-menu', component:AllSendersComponent, canActivate:[AuthGuard]},
  {path:'chat/:otherUserId', component:ChatComponent, canActivate:[AuthGuard]},
  {path:'reservations-summary', component:ReservationsComponent, canActivate:[AuthGuard]}
];
