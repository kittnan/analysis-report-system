import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../master-manage/master.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipment-manage',
  templateUrl: './equipment-manage.component.html',
  styleUrls: ['./equipment-manage.component.css']
})
export class EquipmentManageComponent implements OnInit {

  Equipment: any[] = []
  EquipmentFiltered: any[] = []

  EquipmentForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    analysisEquipmentName: new FormControl('', Validators.required),
    field: new FormControl('', Validators.required),
    analysisScope: new FormControl('', Validators.required),
    defectMode: new FormControl([], Validators.required),
    limitationOfSample: new FormControl('', Validators.required),
    province: new FormControl([], Validators.required),
    brand: new FormControl('', Validators.required),
    // analysisFee: new FormControl('', Validators.required),
    urlImage: new FormControl({}, Validators.required),
  })
  public get EquipmentFormControl(): any {
    return this.EquipmentForm.controls
  }

  FileUpload: File

  MASTER: any
  Field: any
  DefectMode: any
  Brands: any
  Country: any
  constructor(
    private middleAPI: MasterService,
    private modal: NgbModal,
    private route: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.getEquipment()
    this.MASTER = await this.middleAPI.getMaster()
    this.Country = await this.setCountry()
    this.setMaster()
  }

  setMaster() {
    this.Field = this.MASTER.find(m => (m.master).toLowerCase().includes('field'))
    console.log(this.Field);
    this.DefectMode = this.MASTER.find(m => (m.master).toLowerCase().includes('defectmode'))
    console.log(this.DefectMode);
    this.Brands = this.MASTER.find(m => (m.master).toLowerCase().includes('brands'))
    console.log(this.Brands);
  }

  // todo set Country
  setCountry() {
    return new Promise(async resolve => {
      const country: any = await this.middleAPI.getCountry()
      const newCountry: any = country.map((c: any) => {
        const newLists: any = c.lists.map((l: any) => {
          return {
            clicked: false,
            ...l,
          }
        })
        c.lists = newLists
        return c
      })
      console.log(newCountry);
      resolve(newCountry)
    })

  }
  setCountryList(equipment: any) {

    let temp: any = equipment.province.reduce((prev: any, current: any) => {
      const temp2: any = current.lists.reduce((prev2: any, current2: any) => {
        return prev2.concat(current2)
      }, [])
      return prev.concat(temp2)
    }, [])



    this.Country.map((country: any) => {
      const resultFind: any = country.lists.map((list: any) => {
        // console.log('TEMP@@!@@@@@@@', temp);
        if (temp.find((t: any) => t.name == list.name)) {
          list.clicked = true
        }
        return list
      })
      // console.log(resultFind);
      return resultFind
    })
    console.log(this.Country);


    // const extendList: any = equipment.province.reduce((prev, now) => {
    //   return prev.concat(...now.lists)
    // }, [])
    // extendList.map(list => {
    //   this.Country.map(c => {
    //     const find: any = c.lists.find(cList => cList.name == list)
    //     if (find) find.clicked = true
    //   })
    // })
  }
  // todo set Country

  async getEquipment() {
    const equipment: any = await this.middleAPI.getEquipment()
    this.Equipment = equipment
    this.EquipmentFiltered = equipment
    console.log(equipment);

  }

  // todo get value filter
  onKeyUp(e: any) {
    const keyQuery: any = e.target.value.toLowerCase()
    console.log(keyQuery);
    console.log('this.Equipment', this.Equipment);

    if (keyQuery != '') {
      const filtered: any = this.Equipment.filter((equipment: any) =>
        equipment.analysisEquipmentName.toLowerCase().includes(keyQuery) ||
        equipment.field.toLowerCase().includes(keyQuery) ||
        equipment.limitationOfSample.toLowerCase().includes(keyQuery) ||
        equipment.analysisScope.toLowerCase().includes(keyQuery) ||
        equipment.defectMode.find((d: any) => d.toLowerCase().includes(keyQuery)) ||
        equipment.province.find((p: any) => p.master.toLowerCase().includes(keyQuery)) ||
        equipment.province.find((p: any) => {
          return p.lists.find((l: any) => l.name.toLowerCase().includes(keyQuery))
        })
      )
      console.log(filtered);
      this.EquipmentFiltered = filtered
    } else {
      this.EquipmentFiltered = this.Equipment
    }

  }
  // todo get value filter

  // ! ------------------------------------ MODAL
  // todo open modal
  async openModalEditEquipment(content: any, equipment: any) {
    console.log(equipment);
    this.modal.open(content, { size: 'xl' })
    var btnOutput: any = document.getElementById('btnOutput')
    var output: any = document.getElementById('output')
    if (equipment.urlImage) {
      output.src = equipment.urlImage.url
      this.FileUpload = equipment.urlImage
      btnOutput.hidden = true
      output.hidden = false
    } else {
      btnOutput.hidden = false
      output.hidden = true
    }
    this.EquipmentForm.patchValue(equipment)
    this.Country = await this.setCountry()
    this.setCountryList(equipment)

  }
  // todo open modal


  // todo Upload Image

  onUploadImage(e: any) {

    if (e.target.files[0].size > 5000000) {
      Swal.fire('Maximum size 5Mb!', '', 'warning')
    } else {
      var btnOutput: any = document.getElementById('btnOutput')
      var output: any = document.getElementById('output')
      this.FileUpload = e.target.files[0]
      console.log(this.FileUpload);

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

  }

  // todo Upload Image

  // todo ModelMode

  onClickAddModelCode() {
    let defectMode: any = document.getElementById('defectMode')
    let oldValue: any = this.EquipmentForm.controls['defectMode'].value

    oldValue.push(defectMode.value)
    this.EquipmentForm.controls['defectMode'].setValue(oldValue)
    defectMode.value = ''
  }

  onClickDeleteModelModeList(index: number) {
    let oldValue: any = this.EquipmentForm.controls['defectMode'].value
    oldValue.splice(index, 1)
    this.EquipmentForm.controls['defectMode'].setValue(oldValue)
  }
  // todo ModelMode

  // todo modal select province
  openModal(content: any) {
    this.modal.open(content, { size: 'lg' })
  }
  // onClickBox(i, i2) {
  //   this.Country[i].lists[i2].clicked == true ? this.Country[i].lists[i2].clicked = false : this.Country[i].lists[i2].clicked = true

  //   let tempExternal: any = this.EquipmentForm.controls['province'].value

  //   const resultFind: any = tempExternal.find((t: any) => t.country == this.Country[i].master)
  //   if (!resultFind) {
  //     tempExternal.push({
  //       country: this.Country[i].master,
  //       lists: [this.Country[i].lists[i2].name]
  //     })
  //   } else {
  //     const indexExternal: number = tempExternal.indexOf(resultFind)
  //     const resultFindLists: any = tempExternal[indexExternal].lists.find(r => r == this.Country[i].lists[i2].name)
  //     if (resultFindLists) {
  //       const indexList = tempExternal[indexExternal].lists.indexOf(resultFindLists)
  //       tempExternal[indexExternal].lists.splice(indexList, 1)
  //       if (tempExternal[indexExternal].lists.length == 0) {
  //         const indexCountry: number = tempExternal.indexOf(tempExternal[indexExternal])
  //         tempExternal.splice(indexCountry, 1)
  //       }
  //     } else {
  //       tempExternal[indexExternal].lists.push(this.Country[i].lists[i2].name)
  //     }
  //   }
  //   this.EquipmentForm.controls['province'].setValue(tempExternal)
  //   console.log(this.EquipmentForm.controls['province'].value);

  // }
  onCheckBox(item2: any) {
    item2.clicked = !item2.clicked
    // console.log('event', e.target.checked);
    // console.log(item2);
    // console.log(this.Country);
    console.clear()
    console.log(this.Country);

    const selectedCountry: any = this.Country.map((country: any) => {
      const newLists: any = country.lists.filter((list: any) => list.clicked == true)
      const resultReduce: any = newLists.reduce((prev: any, current: any) => {
        return prev.concat(current)
      }, [])
      const temp = {
        master: country.master,
        lists: resultReduce
      }
      return temp
    })
    console.log(selectedCountry);
    let province: any = selectedCountry.filter((s: any) => s.lists.length > 0)
    console.log(province);
    this.EquipmentForm.controls['province'].setValue(province)
    console.log(this.EquipmentForm.value);

  }
  // todo modal select province

  // todo submit
  onClickSave() {

    Swal.fire({
      title: 'Do you want to save equipment?',
      icon: 'question',
      showCancelButton: true,
    }).then(async r => {
      if (r.isConfirmed) {
        this.updateEquipment()
      }
    })


  }

  // ? add new equipment
  async updateEquipment() {
    try {
      const equipment: any = await this.middleAPI.getEquipment()
      await this.checkDuplicateEquipmentName(equipment, this.EquipmentForm.value)

      if (this.FileUpload.lastModified) {
        const resultUpload: any = await this.uploadImg()
        this.EquipmentForm.patchValue({
          urlImage: resultUpload
        })
      }
      console.log(this.EquipmentForm.value);
      await this.middleAPI.updateEquipment(this.EquipmentFormControl['_id'].value, this.EquipmentForm.value)
      Swal.fire('Success', '', 'success')
      this.modal.dismissAll()
    } catch (error) {
      console.log(error);
      Swal.fire(error, '', 'error')
    } finally {
      this.getEquipment()
    }

  }
  // ? add new equipment


  //  ? check duplicate
  checkDuplicateEquipmentName(equipment: any, updateEquipment: any) {
    return new Promise((resolve, reject) => {
      console.log('checkDuplicateEquipmentName');
      if (equipment.find(eq =>
        eq.analysisEquipmentName == updateEquipment.analysisEquipmentName && eq._id != updateEquipment._id
      )) reject('equipment name as duplicate')
      resolve(true)
    })
  }
  //  ? check duplicate


  // ? upload img
  uploadImg() {
    return new Promise(async resolve => {
      let formData: FormData = new FormData()
      const oldFileName: any = this.FileUpload.name.split('.')
      const type = '.' + oldFileName[oldFileName.length - 1]
      const fileName = this.EquipmentForm.controls['analysisEquipmentName'].value + type
      formData.append('File', this.FileUpload, fileName)
      console.log('form data before upload', formData);
      const result: any = await this.middleAPI.uploadImgEquipment(formData)
      console.log('result upload img: ', result);
      const urlImage = {
        size: this.FileUpload.size,
        url: result + '?' + this.FileUpload.lastModified,
        name: fileName
      }
      resolve(urlImage)
    })
  }
  // ? upload img


  // todo submit

  // todo delete equipment
  onDeleteEquipment() {
    console.clear()
    console.log(this.EquipmentForm.value);
    Swal.fire({
      title: `Do you want to delete ${this.EquipmentFormControl['analysisEquipmentName'].value}?`,
      icon: 'question',
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        this.deleteEquipment(this.EquipmentFormControl['_id'].value)
      }
    })

  }
  async deleteEquipment(id: any) {
    try {
      await this.middleAPI.deleteEquipment(id)
      Swal.fire('Success', '', 'success')
    } catch (error) {
    } finally {
      this.modal.dismissAll()
      this.getEquipment()
    }
  }
  // todo delete equipment


  // ! ------------------------------------ MODAL

}
