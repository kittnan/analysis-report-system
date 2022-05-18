import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeyObject } from 'crypto';
import { MasterService } from '../master-manage/master.service';

@Component({
  selector: 'app-add-equipment',
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.css']
})
export class AddEquipmentComponent implements OnInit {

  FileUpload: File

  newEquipment = new FormGroup({
    analysisEquipmentName: new FormControl('', Validators.required),
    field: new FormControl('', Validators.required),
    analysisScope: new FormControl('', Validators.required),
    defectMode: new FormControl([], Validators.required),
    limitationOfSample: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    province: new FormControl([], Validators.required),
    brand: new FormControl('', Validators.required),
    analysisFee: new FormControl('', Validators.required),
    urlImage: new FormControl('', Validators.required),
  })

  public get newEquipmentControl(): any {
    return this.newEquipment.controls
  }

  MASTER: any
  Field: any
  DefectMode: any
  Country: any

  constructor(
    private middleAPI: MasterService,
    private modal: NgbModal
  ) { }

  async ngOnInit(): Promise<void> {
    this.MASTER = await this.middleAPI.getMaster()
    this.setCountry()
    this.setMaster()
  }

  setMaster() {
    this.Field = this.MASTER.find(m => (m.master).toLowerCase().includes('field'))
    console.log(this.Field);
    this.DefectMode = this.MASTER.find(m => (m.master).toLowerCase().includes('defectmode'))
    console.log(this.DefectMode);

  }

  // todo set Country
  async setCountry() {
    const country: any = await this.middleAPI.getCountry()
    const newCountry: any = country.map((c: any) => {
      const newLists: any = c.lists.map((l: any) => {
        return {
          name: l,
          clicked: false
        }
      })
      c.lists = newLists
      return c
    })
    console.log(newCountry);
    this.Country = newCountry

  }
  // todo set Country

  // todo Upload Image

  onUploadImage(e: any) {

    var btnOutput: any = document.getElementById('btnOutput')
    var output: any = document.getElementById('output')
    this.FileUpload = e.target.files[0]
    if (e.target.files.length > 0) {
      output.src = URL.createObjectURL(this.FileUpload);
      output.onload = function () {
        URL.revokeObjectURL(output.src) // free memory
      }
      btnOutput.hidden = true
      output.hidden = false
    } else {
      btnOutput.hidden = false
      output.hidden = true

    }
  }

  // todo Upload Image


  // todo ModelMode

  onClickAddModelCode() {
    let defectMode: any = document.getElementById('defectMode')
    let oldValue: any = this.newEquipment.controls['defectMode'].value

    oldValue.push(defectMode.value)
    this.newEquipment.controls['defectMode'].setValue(oldValue)
    defectMode.value = ''
  }

  onClickDeleteModelModeList(index: number) {
    let oldValue: any = this.newEquipment.controls['defectMode'].value
    oldValue.splice(index, 1)
    this.newEquipment.controls['defectMode'].setValue(oldValue)
  }
  // todo ModelMode

  // todo modal
  openModal(content: any) {
    this.modal.open(content, { size: 'lg' })
  }
  onClickBox(i, i2) {
    this.Country[i].lists[i2].clicked == true ? this.Country[i].lists[i2].clicked = false : this.Country[i].lists[i2].clicked = true
    console.log(this.Country[i].lists[i2]);

    let tempExternal: any = this.newEquipment.controls['province'].value

    const resultFind: any = tempExternal.find((t: any) => t.country == this.Country[i].master)
    console.log(resultFind);
    if (!resultFind) {
      tempExternal.push({
        country: this.Country[i].master,
        lists: [this.Country[i].lists[i2].name]
      })
    } else {
      const indexExternal: number = tempExternal.indexOf(resultFind)
      console.log(indexExternal);
      const resultFindLists: any = tempExternal[indexExternal].lists.find(r => r == this.Country[i].lists[i2].name)
      if (resultFindLists) {
        const indexList = tempExternal[indexExternal].lists.indexOf(resultFindLists)
        tempExternal[indexExternal].lists.splice(indexList, 1)
        if (tempExternal[indexExternal].lists.length == 0) {
          const indexCountry:number = tempExternal.indexOf(tempExternal[indexExternal])
          tempExternal.splice(indexCountry,1)
        }
      } else {
        tempExternal[indexExternal].lists.push(this.Country[i].lists[i2].name)
      }
    }
    this.newEquipment.controls['province'].setValue(tempExternal)
    console.log(this.newEquipment.controls['province'].value);

  }
  // todo modal






}
