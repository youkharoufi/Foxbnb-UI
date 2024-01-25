import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Property } from '../Models/property';
import { PropertyService } from '../Services/property.service';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MatPaginatorModule],
  providers:[PropertyService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent implements OnInit{

  currentPage = 1;
  properties:Property[]=[];
  currentProperties!:Property[];
  pageSize: number = 1;

  constructor(private propertyService: PropertyService, private router: Router){}

  ngOnInit(): void{
    this.propertyService.getAllProperties().subscribe({
      next:(value:Property[])=>{
        this.properties = value;
        this.updateCurrentProperties();
      }
    })


  }

  filterAll(){
    this.propertyService.getAllProperties().subscribe({
      next:(value:Property[])=>{
        this.properties = value;
        this.updateCurrentProperties();

      }
    })
  }

  filterAppartments(){
    this.propertyService.getPropertiesByType('Appartment').subscribe({
      next:(value:Property[])=>{
        this.properties = value;
        this.updateCurrentProperties();

      }
    })
  }

  filterVillaHouse(){
    this.propertyService.getPropertiesByType('Villa House').subscribe({
      next:(value:Property[])=>{
        this.properties = value;
        this.updateCurrentProperties();

      }
    })
  }

  filterPenthouse(){
    this.propertyService.getPropertiesByType('Penthouse').subscribe({
      next:(value:Property[])=>{
        this.properties = value;
        this.updateCurrentProperties();

      }
    })
  }


  handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.currentProperties = this.properties.slice(startIndex, endIndex);
  }

  private updateCurrentProperties() {
    this.currentProperties = this.properties.slice(0, this.pageSize);
  }

  redirectToDetails(propertyId:string){
    this.router.navigateByUrl('/property-details/'+propertyId);
  }
}
