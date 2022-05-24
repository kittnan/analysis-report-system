import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ExportEquipmentService {

  constructor() { }

  async onExport(equipmentFiltered: any) {
    try {
      const dataMap: any = await this.mapData(equipmentFiltered)
      const wb: any = await this.loadExcel(dataMap)
      const fileName = `equipment-${new Date().getTime()}.xlsx`
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.log(error);
      Swal.fire(error, '', 'error')
    }
  }

  private mapData(equipmentFiltered) {
    return new Promise(resolve => {
      const result: any = equipmentFiltered.map((e: any) => {
        return {
          analysisEquipmentName: e.analysisEquipmentName,
          analysisScope: e.analysisScope,
          defectMode: this.concatDefectMode(e.defectMode),
          limitationOfSample: e.limitationOfSample,
          country: this.concatCountry(e.province)
        }
      })
      resolve(result)
    })
  }

  private concatDefectMode(defectMode: any) {
    return defectMode.reduce((prev: any, now: any) => {
      return prev.concat(now)
    }, '')
  }
  private concatCountry(province: any) {
    return province.reduce((prev: any, now: any) => {
      const lists: any = now.lists.reduce((prev: any, now: any) => {
        return prev.concat(now)
      }, [])
      return prev + `${now.country}:[${lists}]`
    }, [])
  }

  private loadExcel(dataMap: any) {
    return new Promise(resolve => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataMap);
      
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
      resolve(wb)
    })
  }

}
