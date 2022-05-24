import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ExportEquipmentService } from '../export-equipment.service';
import { MasterService } from '../master-manage/master.service';
import { PreviewEquipmentComponent } from '../preview-equipment/preview-equipment.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-search-equipment',
  templateUrl: './search-equipment.component.html',
  styleUrls: ['./search-equipment.component.css']
})
export class SearchEquipmentComponent implements OnInit {

  @ViewChild(PreviewEquipmentComponent)
  Equipment: any
  equipmentFiltered: any[] = []

  tableHead: any[] = []

  filterForm = new FormGroup({
    analysisEquipmentName: new FormControl(''),
    field: new FormControl(''),
    country: new FormControl(''),
    province: new FormControl(''),
    scope: new FormControl(''),
    defectMode: new FormControl(''),
  })

  public get filterFormControl
    (): any {
    return this.filterForm.controls
  }

  Field: any[] = []
  defectMode: any[] = []
  Country: any[] = []
  Province: any[] = []

  Searched: boolean

  constructor(
    private modal: NgbModal,
    private middleAPI: MasterService,
    private exportExcel: ExportEquipmentService
  ) {
    this.tableHead = [
      'No', 'equipment name', 'scope', 'Defect mode', 'Limitation of sample', 'Country && Province'
    ]
  }

  ngOnInit(): void {
    // this.getEquipment()
    this.getMaster()
    this.getCountry()
  }

  async getEquipment() {
    this.Equipment = await this.middleAPI.getEquipment()
    this.equipmentFiltered = this.Equipment
    console.log(this.equipmentFiltered);

  }
  async getMaster() {
    const master: any = await this.middleAPI.getMaster()
    console.log(master);
    this.Field = master.find(m => m.master.toLowerCase() == 'field')
    this.defectMode = master.find(m => m.master.toLowerCase() == 'defectmode')
    console.log('this.defectMode', this.defectMode);

  }
  async getCountry() {
    const country: any = await this.middleAPI.getCountry()
    console.log(country)
    this.Country = country.reduce((prev, now) => {
      let temp: any[] = prev
      temp.push(now.master)
      return temp
    }, [])
    console.log(this.Country);

    this.Province = country.reduce((prev, now) => {
      return prev.concat(now.lists)
    }, [])
    console.log(this.Province);
  }

  // todo search
  async onSearch() {

    try {
      const equipment: any = await this.middleAPI.getEquipment()
      this.Equipment = equipment
      this.equipmentFiltered = equipment
      const resultDelete: any = await this.deleteEmptyFilter(this.filterForm.value)
      console.log('resultDelete', resultDelete);
      const filtered: any = await this.filter(resultDelete, equipment)
      console.log('filtered', filtered);
      this.equipmentFiltered = filtered
    } catch (error) {

    }

  }

  // ? delete empty filter
  deleteEmptyFilter(objectRaw: any) {
    return new Promise(resolve => {
      let newObj: any = objectRaw
      for (const key in objectRaw) {
        if (newObj[key] == '' || newObj[key] == null) delete newObj[key]
      }
      resolve(newObj)
    })
  }
  // ? delete empty filter

  // ? filter
  filter(objFiltered: any, equipments: any) {
    return new Promise(resolve => {
      this.Searched = true
      let equipmentFiltered: any = equipments
      for (const key in objFiltered) {
        console.log(objFiltered[key]);

        if (key == 'analysisEquipmentName') {
          equipmentFiltered = equipmentFiltered.filter(e => e.analysisEquipmentName.toLowerCase().includes(objFiltered[key].toLowerCase()))
        }
        if (key == 'field') {
          equipmentFiltered = equipmentFiltered.filter(e => e.field.toLowerCase().includes(objFiltered[key].toLowerCase()))
        }
        if (key == 'country') {
          equipmentFiltered = equipmentFiltered.filter(e => {
            if (e.province.find(p => p.country.toLowerCase().includes(objFiltered[key].toLowerCase()))) return true
            return false
          })
        }
        if (key == 'province') {
          equipmentFiltered = equipmentFiltered.filter(e => {
            const temp: any = e.province.find(p => {
              return p.lists.find(l => l.toLowerCase().includes(objFiltered[key].toLowerCase()))
            })
            if (temp) return true
            return false
          })
        }
        if (key == 'country') {
          equipmentFiltered = equipmentFiltered.filter(e => {
            if (e.province.find(p => p.country.toLowerCase().includes(objFiltered[key].toLowerCase()))) return true
            return false
          })
        }
        if (key == 'scope') {
          equipmentFiltered = equipmentFiltered.filter(e => e.analysisScope.toLowerCase().includes(objFiltered[key].toLowerCase()))
        }
        if (key == 'defectMode') {
          equipmentFiltered = equipmentFiltered.filter(e => {
            if (e.defectMode.find(d => d.toLowerCase().includes(objFiltered[key].toLowerCase()))) return true
            return false
          })
        }
      }
      resolve(equipmentFiltered)
    })
  }
  // ? filter

  // todo search

  // todo export excel
  onClickExport() {
    Swal.fire({
      title: 'Do you want to export data?',
      icon: 'question',
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        // Swal.fire('Success', '', 'success')
        this.exportExcel.onExport(this.equipmentFiltered)
      }
    })
  }
  // todo export excel

  // todo reset filter
  onClickReset() {
    Swal.fire({
      title: 'Do you want to reset filter?',
      icon: 'question',
      showCancelButton: true
    }).then(async r => {
      if (r.isConfirmed) {
        this.filterForm.reset()
        this.Equipment = []
        this.equipmentFiltered = []
        Swal.fire('Success', '', 'success')
      }
    })

  }
  // todo reset filter

  // todo click row
  openModal(item) {
    const modalRef = this.modal.open(PreviewEquipmentComponent, { size: 'xl' })
    modalRef.componentInstance.fromParent = item
  }
  // todo click row


  test(){
    window.open("file:\\10.200.90.12\Public")
  }
}
