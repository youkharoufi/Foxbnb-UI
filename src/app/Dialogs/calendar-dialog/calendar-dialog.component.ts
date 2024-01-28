import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { Component, Inject, NO_ERRORS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { PropertyService } from '../../Services/property.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { v4 as uuidv4 } from 'uuid';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DayInfo } from '../../Models/day-info';
import { DayInfoDto } from '../../Models/day-info-dto';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ApplicationUser } from '../../Models/applicationUser';

export interface Data{
  id:string;
}
@Component({
  selector: 'app-calendar-dialog',
  standalone: true,
  imports: [ FormsModule, MatFormFieldModule,
    MatNativeDateModule, MatDialogModule, MatInputModule,
    MatDatepickerModule, CommonModule, MatButtonModule,
    MatIconModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    provideNativeDateAdapter()
  ],
  schemas:[NO_ERRORS_SCHEMA],
  templateUrl: './calendar-dialog.component.html',
  styleUrl: './calendar-dialog.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CalendarDialogComponent implements OnInit{

  reservedDates:DayInfo[]=[];
  oldDates:DayInfo[]=[];
  startDate!:Date;
  endDate!:Date;
  reservationForm!: NgForm;

  bsConfig!: Partial<BsDatepickerConfig>;
  selectedDateRange!: Date[];
  bookedDates:Date[]=[];
  selectedDates: DayInfo[] = [];

  currentUser!:ApplicationUser;

  constructor(private propertyService: PropertyService, public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data){}

    ngOnInit(): void {
      this.oldDates = [];
      this.propertyService.getAllReservationsForSpecificProperty(this.data.id).subscribe({
        next: (values: DayInfo[]) => {
          console.log(this.reservedDates);
            this.oldDates = values;

        }
      });

      const localUser = JSON.parse(localStorage.getItem('user')!);
      if(localUser !== null && localUser !== undefined){
        this.currentUser = localUser;
      }
    }

    unavailableDays = (d: Date): boolean => {
      // Ensure 'd' is a Date object
      const inputDate = new Date(d);

      for (let disabledDate of this.oldDates) {
        // Convert 'disabledDate.date' from string to Date object if necessary
        const disabledDateObj = new Date(disabledDate.date);

        if (
          inputDate.getDate() === disabledDateObj.getDate() &&
          inputDate.getMonth() === disabledDateObj.getMonth() &&
          inputDate.getFullYear() === disabledDateObj.getFullYear()
        ) {
          // Date is in the reservedDates array, so disable it
          return false;
        }
      }
      // Date is not in the reservedDates array, so enable it
      return true;
    };





onStartDateChange(event: MatDatepickerInputEvent<Date>) {
  this.updateSelectedDates();
}

onEndDateChange(event: MatDatepickerInputEvent<Date>) {
  this.updateSelectedDates();
}

updateSelectedDates() {
  if (this.startDate && this.endDate) {
    // Clear the current selectedDates
    this.selectedDates = [];
    this.reservedDates = [];
    for (let d = new Date(this.startDate); d <= new Date(this.endDate); d.setDate(d.getDate() + 1)) {
      // Create a new Date object for the current day
      let currentDay = new Date(d);
      let dateString = currentDay.toISOString().split('T')[0];

      const formData = new FormData();
      formData.append('dayString', dateString);
      this.propertyService.isBooked(this.data.id, formData).subscribe({
        next:(value:boolean)=>{

          console.log(value)

          if(value === false){

          let dayInfo = {
            id: uuidv4(),
            propertyId: this.data.id,
            userId:this.currentUser.id!,
            date: currentDay, // Use the new Date object here
            booked: true,
          }
          this.oldDates.push(dayInfo)
          this.reservedDates.push(dayInfo);
          console.log(this.reservedDates);
          }else{
            let dayInfo = {
              id: uuidv4(),
              propertyId: this.data.id,
              userId:this.currentUser.id!,
              date: currentDay, // Use the new Date object here
              booked: true,
            }
            this.selectedDates.push(dayInfo);
          }

          // Proceed to the next day regardless of whether it was booked

        }
      });


    }
    }

  }




  makeReservation(){

    const allDayNga: Date[]=[];

    console.log(this.reservedDates);
    this.reservedDates.forEach((d)=>{
      allDayNga.push(new Date(d.date))
    })

    const dayInfoDto : DayInfoDto = {
      propertyId:this.data.id,
      userId:this.currentUser.id!,
      allDaysToBook: allDayNga
    }
    this.propertyService.makeReservation(dayInfoDto).subscribe({
      next:(value:DayInfo[])=>{
        console.log("Skusku");
      }
    });
    this.reservedDates = [];
    this.selectedDates= [];
    this.onNoClick();
  }

  onNoClick(): void {
    this.reservedDates = [];
    this.selectedDates = [];
    this.dialogRef.close();
  }

}
