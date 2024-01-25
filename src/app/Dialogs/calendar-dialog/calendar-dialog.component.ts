import { DateFilterFn, MatCalendarCellCssClasses, MatDatepickerModule } from '@angular/material/datepicker';
import { Component, Inject, NO_ERRORS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { DateRangeRes } from '../../Models/date-range';
import { PropertyService } from '../../Services/property.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { v4 as uuidv4 } from 'uuid';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';



export interface Data{
  id:string;
}

@Component({
  selector: 'app-calendar-dialog',
  standalone: true,
  imports: [ FormsModule, MatFormFieldModule,
    MatNativeDateModule, MatDialogModule, MatInputModule, MatDatepickerModule],
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

  reservedDates:DateRangeRes[]=[];
  startDate!:Date;
  endDate!:Date;
  reservationForm!: NgForm;

  bsConfig!: Partial<BsDatepickerConfig>;
  selectedDateRange!: Date[];

  constructor(private propertyService: PropertyService,  public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data){}

  ngOnInit(): void{
    this.propertyService.getAllReservationsForSpecificProperty(this.data.id).subscribe({
      next:(values: DateRangeRes[])=>{
        if(values === null){
          console.log("null");
        }else{
          this.reservedDates = values;
          console.log(this.reservedDates)
        }

      }
    })
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    return 'custom-disabled-date'; // Apply to all dates to test
  }


  private isIntervalReserved(start: Date, end: Date): boolean {
    for (let reserved of this.reservedDates) {
        if (start < reserved.endDate && end > reserved.startDate) {
            return true;
        }
    }
    return false;
}

myFilter = (d: Date | null): boolean => {
  if (d) {
    return !this.isIntervalReserved(d, d);
  }
  return true;
}

  onDateRangeChanged(): void {
    if (this.startDate && this.endDate) {
        if (this.isIntervalReserved(this.startDate, this.endDate)) {

          console.log("Interval already reserved !")
        } else {
            console.log("Correct interval");
            // this.makeReservation();
        }
    }
}

  makeReservation(){
    const reservationRange : DateRangeRes ={
      id:uuidv4(),
      propertyId:this.data.id,
      startDate:new Date(this.startDate),
      endDate:new Date(this.endDate),
      daysInRange:[]
    };

    console.log(reservationRange);

    this.propertyService.makeReservation(reservationRange).subscribe({
      next:(value:DateRangeRes)=>{
        console.log(value.startDate+" reserved... "+value.endDate)
      }
    });
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  unavailableDays: DateFilterFn<Date | null> = (calendarDate: Date | null): boolean => {
    if (!calendarDate) {
      return true;
    }

    const calendarDateOnly = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());

    // Check if the date is in the past
    if (calendarDateOnly < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
      return false;
    }

    // Check if the date is reserved
    return !this.reservedDates.some(range => {
      return range.daysInRange.some(reservedDay => {
        const reservedDayDate = new Date(reservedDay);
        return calendarDateOnly.getTime() === reservedDayDate.getTime();
      });
    });
  };




}
