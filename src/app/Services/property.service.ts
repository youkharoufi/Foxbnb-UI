import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Property } from '../Models/property';
import { DayInfo } from '../Models/day-info';
import { DayInfoDto } from '../Models/day-info-dto';

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

  makeReservation(daysToBook:DayInfoDto): Observable<DayInfo[]>{
    return this.http.post<DayInfo[]>(this.baseUrl+"property/make-reservation", daysToBook)
  }

  getAllReservationsForSpecificProperty(propertyId:string): Observable<DayInfo[]>{
    return this.http.get<DayInfo[]>(this.baseUrl+"property/get-all-reservations/"+propertyId);
  }

  isBooked(propertyId:string, dayString:FormData): Observable<boolean>{
    return this.http.post<boolean>(this.baseUrl+"property/is-booked/"+propertyId, dayString)
  }
}
