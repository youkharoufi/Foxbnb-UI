import { Component, OnInit } from '@angular/core';
import { DayInfo } from '../Models/day-info';
import { Property } from '../Models/property';
import { PropertyService } from '../Services/property.service';
import { ApplicationUser } from '../Models/applicationUser';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit{

  reservations: DayInfo[] = [];
  properties:Property[] = [];
  actualSingleProperties:Property[]=[];
  currentUser!:ApplicationUser;

  constructor(private propertyService: PropertyService){}

  ngOnInit(): void {
    const localUser = JSON.parse(localStorage.getItem('user')!);
    if (localUser) {
      this.currentUser = localUser;

      this.propertyService.getReservationsByUserId(this.currentUser.id!).subscribe({
        next: (reservations: DayInfo[]) => {
          this.reservations = reservations;
          const propertyObservables = reservations.map(o => this.propertyService.getPropertyById(o.propertyId));

          forkJoin(propertyObservables).subscribe((properties: Property[]) => {
            this.properties = properties;

            // Now you can process this.properties as it's fully loaded
            this.actualSingleProperties = this.properties.filter((property, index, self) =>
              index === self.findIndex(t => t.id === property.id)
            );
          });
        }
      });
    }
  }

}
