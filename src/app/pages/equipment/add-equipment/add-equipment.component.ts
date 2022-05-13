import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    province: new FormControl('', Validators.required),
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
  Country:any

  constructor(
    private middleAPI: MasterService
  ) { }

  async ngOnInit(): Promise<void> {
    this.MASTER = await this.middleAPI.getMaster()
    this.setMaster()
  }

  setMaster() {
    this.Field = this.MASTER.find(m => (m.master).toLowerCase().includes('field'))
    console.log(this.Field);
    this.DefectMode = this.MASTER.find(m => (m.master).toLowerCase().includes('defectmode'))
    console.log(this.DefectMode);
    this.Country = this.MASTER.find(m => (m.master).toLowerCase().includes('country'))
    console.log(this.Country);

  }

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
    oldValue.splice(index,1)
    this.newEquipment.controls['defectMode'].setValue(oldValue)
  }
  // todo ModelMode


}
