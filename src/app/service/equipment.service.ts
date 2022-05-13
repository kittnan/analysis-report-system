import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'environments/environment'
@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(
    private http: HttpClient
  ) { }
  Url: any = environment.UrlApi
  Equipment: any = environment.equipment
  Country: any = environment.country

  // todo normal master

  GetMaster(): Observable<any> {
    return this.http.get(this.Url + "/" + this.Equipment);
  }
  InsertMaster(data: any): Observable<any> {
    return this.http.post(this.Url + "/" + this.Equipment + "/add", data);
  }
  UpdateMaster(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/" + this.Equipment + "/update/" + id, data);
  }
  DeleteMaster(id: any): Observable<any> {
    return this.http.delete(this.Url + "/" + this.Equipment + "/delete/" + id);
  }
  // todo normal master


  // todo country master
  GetCountry(): Observable<any> {
    return this.http.get(this.Url + "/" + this.Country);
  }
  InsertCountry(data: any): Observable<any> {
    return this.http.post(this.Url + "/" + this.Country + "/add", data);
  }
  UpdateCountry(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/" + this.Country + "/update/" + id, data);
  }
  DeleteCountry(id: any): Observable<any> {
    return this.http.delete(this.Url + "/" + this.Country + "/delete/" + id);
  }
  // todo country master

}
