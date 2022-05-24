import { Injectable } from '@angular/core';
import { EquipmentService } from 'app/service/equipment.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(
    private api: EquipmentService
  ) { }

  // todo normal master

  getMaster() {
    return new Promise(resolve => {
      this.api.GetMaster().subscribe(res => {
        resolve(res)
      })
    })
  }

  insertMaster(data: any) {
    return new Promise(resolve => {
      this.api.InsertMaster(data).subscribe(res => {
        resolve(res)
      })
    })
  }

  updateMaster(id: string, data: any) {
    return new Promise(resolve => {
      this.api.UpdateMaster(id, data).subscribe(res => {
        resolve(res)
      })
    })
  }

  deleteMaster(id: string) {
    return new Promise(resolve => {
      this.api.DeleteMaster(id).subscribe(res => {
        resolve(res)
      })
    })
  }

  // todo normal master


  // todo country master
  getCountry() {
    return new Promise(resolve => {
      this.api.GetCountry().subscribe(res => {
        resolve(res)
      })
    })
  }

  insertCountry(data: any) {
    return new Promise(resolve => {
      this.api.InsertCountry(data).subscribe(res => {
        resolve(res)
      })
    })
  }

  updateCountry(id: string, data: any) {
    return new Promise(resolve => {
      this.api.UpdateCountry(id, data).subscribe(res => {
        resolve(res)
      })
    })
  }

  deleteCountry(id: string) {
    return new Promise(resolve => {
      this.api.DeleteCountry(id).subscribe(res => {
        resolve(res)
      })
    })
  }
  // todo country master

  // todo equipment
  getEquipment() {
    return new Promise(resolve => {
      this.api.GetEquipment().subscribe(res => {
        resolve(res)
      })
    })
  }

  insertEquipment(data: any) {
    return new Promise(resolve => {
      this.api.InsertEquipment(data).subscribe(res => {
        resolve(res)
      })
    })
  }

  updateEquipment(id: string, data: any) {
    return new Promise(resolve => {
      this.api.UpdateEquipment(id, data).subscribe(res => {
        resolve(res)
      })
    })
  }

  deleteEquipment(id: string) {
    return new Promise(resolve => {
      this.api.DeleteEquipment(id).subscribe(res => {
        resolve(res)
      })
    })
  }
  uploadImgEquipment(formData: FormData) {
    return new Promise(resolve => {
      this.api.UploadImgEquipment(formData).subscribe(res => {
        resolve(res)
      })
    })
  }
  // todo equipment


}
