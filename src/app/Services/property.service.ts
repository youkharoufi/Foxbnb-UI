import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Property } from '../Models/property';
import { DateRangeRes } from '../Models/date-range';

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

  makeReservation(reservation:DateRangeRes): Observable<DateRangeRes>{
    return this.http.post<DateRangeRes>(this.baseUrl+"property/make-reservation", reservation)
  }

  getAllReservationsForSpecificProperty(propertyId:string): Observable<DateRangeRes[]>{
    return this.http.get<DateRangeRes[]>(this.baseUrl+"property/get-all-reservations/"+propertyId);
  }
}
