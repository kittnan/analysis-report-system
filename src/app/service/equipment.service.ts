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
  Master: any = environment.master
  Country: any = environment.country
  Equipment: any = environment.equipment

  // todo normal master

  GetMaster(): Observable<any> {
    return this.http.get(this.Url + "/" + this.Master);
  }
  InsertMaster(data: any): Observable<any> {
    return this.http.post(this.Url + "/" + this.Master + "/add", data);
  }
  UpdateMaster(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/" + this.Master + "/update/" + id, data);
  }
  DeleteMaster(id: any): Observable<any> {
    return this.http.delete(this.Url + "/" + this.Master + "/delete/" + id);
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
  UploadQuotation(formData: FormData): Observable<any> {
    return this.http.post(this.Url + "/" + this.Country + "/upload", formData);
  }
  RemoveQuotation(filename:any): Observable<any> {
    return this.http.post(this.Url + "/" + this.Country + "/remove", filename);
  }

  // todo country master

  // todo equipment
  GetEquipment(): Observable<any> {
    return this.http.get(this.Url + "/" + this.Equipment);
  }
  InsertEquipment(data: any): Observable<any> {
    return this.http.post(this.Url + "/" + this.Equipment + "/add", data);
  }
  UpdateEquipment(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/" + this.Equipment + "/update/" + id, data);
  }
  DeleteEquipment(id: any): Observable<any> {
    return this.http.delete(this.Url + "/" + this.Equipment + "/delete/" + id);
  }
  UploadImgEquipment(formData: FormData): Observable<any> {
    return this.http.post(this.Url + "/" + this.Equipment + "/upload", formData);
  }
  // todo equipment


}
