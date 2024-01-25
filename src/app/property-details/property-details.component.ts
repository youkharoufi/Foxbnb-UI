import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Property } from '../Models/property';
import { PropertyService } from '../Services/property.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarDialogComponent } from '../Dialogs/calendar-dialog/calendar-dialog.component';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  providers: [PropertyService],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements OnInit{

  property!:Property;
  propertyId!:string;

  constructor(private route: ActivatedRoute, private propertyService: PropertyService,
    private dialog: MatDialog){}


  ngOnInit(): void{
    this.route.params.subscribe({
      next:(params)=>{
        this.propertyId = params['propertyId'];
        this.propertyService.getPropertyById(this.propertyId).subscribe({
          next:(prop:Property)=>{
            this.property = prop;
            console.log(this.property);
          }
        })
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      data: {id: this.propertyId},
    });

    dialogRef.afterClosed().subscribe(result => {


    });
  }
}
