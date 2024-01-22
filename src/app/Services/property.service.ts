import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Property } from '../Models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService{

  baseUrl= environment.API_URL;

  constructor(private http: HttpClient) { }

  getAllProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(this.baseUrl+"property/all-properties");
  }

  getPropertyById(propertyId:string): Observable<Property>{
    return this.http.get<Property>(this.baseUrl+"property/property-by-id/"+propertyId);
  }

  getPropertiesByType(type:string): Observable<Property[]>{
    return this.http.get<Property[]>(this.baseUrl+"property/properties-by-type/"+type);
  }
}
