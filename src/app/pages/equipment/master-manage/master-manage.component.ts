import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentService } from 'app/service/equipment.service';
import Swal from 'sweetalert2'
import { MasterService } from './master.service';

export interface EquipmentMasterForm {
  master: string,
  lists: string[]
}

@Component({
  selector: 'app-master-manage',
  templateUrl: './master-manage.component.html',
  styleUrls: ['./master-manage.component.css']
})
export class MasterManageComponent implements OnInit {

  // todo set form
  group: any = ''
  master: any = ''
  lists: any[] = []
  listsBoo: boolean[] = []

  newItem: any


  MASTER: any
  Select_Master: any
  Select_Lists_Temp: any

  editItem: any

  // todo country
  Currency: any
  newCountry: any
  newProvince: any
  newFile: any
  newQuotation: any = {}
  newLists: any = []

  editFile: any
  constructor(
    private md: NgbModal,
    private api: EquipmentService,
    private middleAPI: MasterService
  ) {
  }

  async ngOnInit(): Promise<void> {
    // this.getMaster()

  }

  // ? ----------------------------------------------- top menu
  async onChangeGroupSelect(e: any) {
    this.Select_Master = {}
    const groupName = e.target.value
    this.Select_Master['group'] = groupName
    if (groupName == 'country') {
      this.MASTER = await this.middleAPI.getCountry()
    } else
      if (groupName == 'normal') {
        this.MASTER = await this.middleAPI.getMaster()
      } else {
        this.MASTER = []
      }

  }

  onChangeMasterSelect(e: any) {
    const resultFind: any = this.MASTER.find(m => m.master == e.target.value)
    this.Select_Master = { ...this.Select_Master, ...resultFind }
    console.log(this.Select_Master);

  }

  // todo modal add new master
  onClickModalAddMaster(content: any) {
    this.group = ''
    this.master = ''
    this.lists = []
    this.listsBoo = []
    this.newItem = ''
    this.newLists = []
    this.md.open(content, { size: 'lg' })
  }


  // todo delete master
  onClickDeleteMaster() {

    if (this.Select_Master) {
      Swal.fire({
        title: ` Do you want to delete master: ${this.Select_Master.master}?`,
        icon: 'question',
        showCancelButton: true
      }).then(r => {
        if (r.isConfirmed) {
          this.onDeleteMaster(this.Select_Master._id)
        }
      })
    } else {
      Swal.fire('Please select master delete target!!', '', 'warning')
    }

  }


  // ? ----------------------------------------------- top menu






  // ? --------------------------------- table

  // todo click modal edit master
  onClickEditMasterTable(content: any) {
    console.log(this.Select_Master);
    this.group = this.Select_Master.group
    this.master = this.Select_Master.master
    this.lists = this.Select_Master.lists
    this.listsBoo = this.lists.map(l => true)
    this.md.open(content, { size: 'lg' })

  }

  async onEditCountry(content: any) {
    console.log(this.Select_Master);
    this.group = this.Select_Master.group
    this.newLists = this.Select_Master.lists
    this.newCountry = this.Select_Master.master

    this.Select_Lists_Temp = Array.from(this.Select_Master.lists)


    const normalMaster: any = await this.middleAPI.getMaster()
    this.Currency = normalMaster.find((m: any) => m.master.toLowerCase().includes('currency'))
    console.log(this.Currency);
    this.newQuotation['currency'] = this.Currency.lists[0]
    this.md.open(content, { size: 'lg' })
  }
  // ? --------------------------------- table


  // ? --------------------------------- option

  checkTable() {
    if (this.Select_Master && this.Select_Master.lists != undefined) {
      return true
    }
    return false
  }

  // todo update master
  async updateNormal(body: any) {
    try {
      const master = await this.middleAPI.getMaster()
      await this.checkDuplicateNormalMaster(master, this.Select_Master)
      console.log(body);

      await this.middleAPI.updateMaster(body._id, body)
      this.md.dismissAll()
      Swal.fire('Success', '', 'success')
      let group: any = document.getElementById('top-group') as HTMLInputElement
      group.value = ''
      this.MASTER = await this.middleAPI.getMaster()
      this.Select_Master = {}
    }
    catch (error) {
      console.log(error);
      Swal.fire(error, '', 'error')
    }

  }
  // todo update master

  // todo check duplicate normal master
  checkDuplicateNormalMaster(master: any, newMaster: any) {
    return new Promise((resolve, reject) => {
      if (master.find((m: any) => m.master.toLowerCase() == newMaster.master.toLowerCase() && m._id != newMaster._id)) {
        reject('duplicate master name')
      } else {
        resolve(true)
      }
    })
  }
  // todo check duplicate normal master

  // todo call master name **require group name
  async callMasterName() {
    if (this.Select_Master.group == 'country') {
      this.MASTER = await this.middleAPI.getCountry()
    } else
      if (this.Select_Master.group == 'normal') {
        this.MASTER = await this.middleAPI.getMaster()
      } else {
        this.MASTER = []
      }
  }
  // todo call master name **require group name

  // todo delete master

  async onDeleteMaster(id: any) {
    console.log('onDeleteMaster');

    try {
      const resultDelete: any = await this.deleteMaster(this.Select_Master.group, id)
      console.log('resultDelete', resultDelete);

      if (resultDelete.deletedCount > 0) {

        this.callMasterName()

        this.Select_Master = {}
        let group: any = document.getElementById('top-group') as HTMLInputElement
        this.Select_Master['group'] = group.value
        Swal.fire('Success', '', 'success')
      } else {
        Swal.fire('Fail', '', 'error')
      }
    } catch (error) {
      console.log(error);
    }

  }

  deleteMaster(group: string, id: string) {
    return new Promise(async (resolve, reject) => {
      if (group == 'normal') {
        const resultDelete: any = await this.middleAPI.deleteMaster(id)
        resolve(resultDelete)

      } else if (group == 'country') {
        const resultDelete: any = await this.middleAPI.deleteCountry(id)
        resolve(resultDelete)
      }


    })
  }
  // todo delete master


  // todo modal add normal item

  addItem() {
    const trimNewItem = this.newItem.trim()
    if (this.lists.find(l => l == trimNewItem)) {
      Swal.fire('Duplicate list', '', 'error')
    } else {
      this.lists.push(trimNewItem)
      this.newItem = ''
      this.listsBoo = this.lists.map(l => true)
    }
  }
  onClickDeleteList(index: number) {
    Swal.fire({
      title: `Do you want to delete ${this.lists[index]}?`,
      icon: 'question',
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        this.lists.splice(index, 1)
        this.listsBoo = this.lists.map(l => true)
      }
    })
  }


  checkDisableAddItem() {
    if (this.newItem != '' && this.newItem != null && this.newItem != undefined) {
      return false
    }
    return true
  }

  checkSave() {
    if (this.master != '' && this.lists.length != 0 && this.group != '') {
      return false
    }
    return true
  }
  onSave(key: string) {
    Swal.fire({
      title: 'Do you want to add new master?',
      icon: 'question',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        if (key == 'insert') {
          this.insertNormal()
        } else if (key == 'update') {
          console.log(this.group, this.Select_Master.group);
          // this.Select_Master.master = this.master
          // this.Select_Master.lists = this.lists
          let newNormal: any = Object.create(this.Select_Master)
          newNormal.master = this.master
          newNormal.lists = this.lists
          this.updateNormal(newNormal)

          // if (this.group != this.Select_Master.group) {
          //   this.onSwapGroup()
          // } else {
          //   this.updateMaster(this.Select_Master, this.group)
          // }

        }
      }
    })
  }

  async insertNormal() {
    try {
      let data: EquipmentMasterForm = {
        master: this.master,
        lists: this.lists
      }
      const master: any = await this.middleAPI.getMaster()
      if (master.find(m => m.master == this.master)) {
        Swal.fire('Duplicate master', '', 'error')
      } else {
        await this.middleAPI.insertMaster(data)
        this.md.dismissAll()
        this.MASTER = await this.middleAPI.getMaster()
        Swal.fire('Success', '', 'success')
      }

    } catch (error) {
      console.log(error);
    }
  }

  toggleEditList(index: number) {
    this.listsBoo[index] == true ? this.listsBoo[index] = false : this.listsBoo[index] = true
    this.editItem = this.lists[index]


  }
  onChangeEditItem(index: number) {
    console.log(this.editItem);
    this.lists[index] = this.editItem
  }

  // todo modal add normal item



  // todo modal add country item
  async onChangeGroupModal() {
    // this.clearAddCountry()
    const normalMaster: any = await this.middleAPI.getMaster()
    this.Currency = normalMaster.find((m: any) => m.master.toLowerCase().includes('currency'))
    console.log(this.Currency);

    this.master = ''
    this.newItem = ''
    this.lists = []

    this.newCountry = ''
    this.newProvince = ''
    this.newFile = ''
    this.newQuotation = {}
    this.newLists = []

    if (this.group == 'country') {
      setTimeout(() => {
        this.newQuotation['currency'] = this.Currency.lists[0]
        let currency: any = document.getElementById('currency')
        currency.value = this.Currency.lists[0]
      }, 1000);
    }

  }
  onUploadFile(event: any) {
    console.log(event.target.files[0]);
    const file: File = event.target.files[0]
    if (file) {
      this.newFile = file
    } else {
      this.newFile = undefined

    }
  }
  onChangeAnalysisFee(e: any) {
    const newAnalysisFee: number = Number(e.target.value)
    console.log('analysisFee', newAnalysisFee);
    if (newAnalysisFee > 0) {
      this.newQuotation['analysisFee'] = e.target.value
    } else {
      let newAnalysisFee: any = document.getElementById('newAnalysisFee')
      this.newQuotation['analysisFee'] = 0
      newAnalysisFee.value = 0
    }
  }
  onChangeCurrency(e: any) {

    this.newQuotation['currency'] = e.target.value
    console.log(e.target.value);
  }
  checkAddProvince() {
    // console.log(this.newCountry, this.newProvince);

    if (
      (this.newCountry == '' || this.newProvince == '') ||
      this.newCountry == undefined || this.newProvince == undefined
    ) {
      return true
    }
    return false
  }
  addProvince() {

    let file: any = []
    if (this.newFile) {
      file = [{
        name: new Date().getTime() + '-' + this.newFile.name || '',
        size: this.newFile.size || '',
        src: this.newFile
      }]
    }
    const newProvince: any = {
      name: this.newProvince || '',
      files: file,
      quotation: {
        analysisFee: Number(this.newQuotation.analysisFee) || '',
        currency: this.newQuotation.currency || '',
      }
    }
    console.log(newProvince);
    this.newLists.push(newProvince)
    this.clearAddCountry()
  }
  private clearAddCountry() {
    this.newProvince = ''
    this.newQuotation = {}
    this.newFile = ''

    let newAnalysisFee: any = document.getElementById('newAnalysisFee') as HTMLInputElement
    newAnalysisFee.value = null
    let newCurrency: any = document.getElementById('currency')
    newCurrency.value = this.Currency.lists[0]
    this.newQuotation['currency'] = this.Currency.lists[0]
    let newUploadFile: any = document.getElementById('uploadFile')
    newUploadFile.value = ''

  }

  onDeleteCountryList(index: any) {

    Swal.fire({
      title: 'Do you want to delete?',
      icon: 'question',
      showCancelButton: true
    }).then(async res => {
      if (res.isConfirmed) {
        this.middleAPI.removeQuotation({
          filename: this.newLists[index].files[0].name
        }).then(res => {
          this.newLists.splice(index, 1)
          this.onUpdateCountry()
        })
      }
    })
  }


  onSaveCountry(key: any) {
    if (key == 'insert') {
      Swal.fire({
        title: 'Do you want to add new country?',
        icon: 'question',
        showCancelButton: true
      }).then(r => {
        if (r.isConfirmed) {
          const data = {
            master: this.newCountry,
            lists: this.newLists
          }
          console.log(data);
          this.insertNewCountry(data)
        }
      })

    }

    if (key == 'update') {

      Swal.fire({
        title: 'Do you want to update?',
        icon: 'question',
        showCancelButton: true,
      }).then(r => {
        if (r.isConfirmed) {
          this.onUpdateCountry()
        }
      })

    }
  }

  async insertNewCountry(data: any) {
    const country: any = await this.middleAPI.getCountry()
    await this.checkDuplicateNewCountryName(country, data)

    let c1: number = 0
    if (data.lists.length > 0) {
      data.lists.forEach(list => {
        if (list.files.length > 0) {
          let formData: FormData = new FormData()
          const oldFileName: any = list.files[0].name.split('.')
          const type = '.' + oldFileName[oldFileName.length - 1]
          const filename = new Date().getTime() + type
          formData.append('File', list.files[0].src, filename)
          this.api.UploadQuotation(formData).toPromise().then(res => {
            if (res) {
              console.log(res);
              c1 += 1;
              const newFile = {
                url: res,
                name: filename,
                size: list.files[0].size
              }
              list.files[0] = newFile
              if (c1 == data.lists.length) {
                console.log('insert');
                console.log(data);
                this.insertCountry(data)
              }
            }
          })
        } else {
          c1 += 1;
          if (c1 == data.lists.length) {
            console.log('insert');
            console.log(data);
            this.insertCountry(data)
          }
        }


      });
    }
  }

  async insertCountry(insertData: any) {
    try {
      await this.middleAPI.insertCountry(insertData)
      Swal.fire('Success', '', 'success')
      this.md.dismissAll()
    } catch (error) {
      console.log(error);
    } finally {
      let group: any = document.getElementById('top-group') as HTMLInputElement
      group.value = ''
      this.MASTER = await this.middleAPI.getMaster()
      this.Select_Master = {}
    }
  }

  // todo modal add country item

  // todo checkDuplicate new Country name
  checkDuplicateNewCountryName(countryMaster: any, newCountry: any) {
    return new Promise((resolve, reject) => {
      if (countryMaster.find(c => c.master.toLowerCase() == newCountry.master.toLowerCase())) {
        reject('New Country name is duplicate.!!')
      } else {
        resolve(true)
      }
    })
  }
  // todo checkDuplicate new Country name

  // ? --------------------------------- option


  // ? --------------------------------------- update Country 
  // todo update country
  async onUpdateCountry() {
    try {
      let body: any = Object.assign({}, this.Select_Master)
      body.master = this.newCountry
      body.lists = Array.from(this.newLists)
      console.log('onUpdateCountry', body);
      console.log('old', this.Select_Lists_Temp);

      const country: any = await this.middleAPI.getCountry()
      await this.checkDuplicateCountryMaster(country, body)

      let c1: number = 0
      if (body.lists.length > 0) {
        body.lists.forEach(list => {
          if (list.files.length > 0 && list.files[0].src) {
            let formData: FormData = new FormData()
            const oldFileName: any = list.files[0].name.split('.')
            const type = '.' + oldFileName[oldFileName.length - 1]
            let filename = new Date().getTime() + type
            if (list.files[0].name != list.files[0].src.name) {
              filename = oldFileName + type
            }

            formData.append('File', list.files[0].src, filename)
            this.api.UploadQuotation(formData).toPromise().then(res => {
              if (res) {
                console.log(res);
                c1 += 1;
                const newFile = {
                  url: res,
                  name: filename,
                  size: list.files[0].size
                }
                list.files[0] = newFile
                if (c1 == body.lists.length) {
                  console.log('update');
                  console.log(body);
                  this.updateCountry(body)
                }
              }
            })
          } else {
            c1 += 1;
            if (c1 == body.lists.length) {
              console.log('update');
              console.log(body);
              this.updateCountry(body)
            }
          }


        });
      }
    } catch (error) {

    }
  }

  async updateCountry(updateData: any) {

    try {
      await this.middleAPI.updateCountry(updateData._id, updateData)
      this.md.dismissAll()
      Swal.fire('Success', '', 'success')
      let group: any = document.getElementById('top-group') as HTMLInputElement
      group.value = ''
      this.MASTER = await this.middleAPI.getMaster()
      this.Select_Master = {}
      this.MASTER = []
    } catch (error) {
      console.log(error);
    }

  }


  // todo update country
  // todo check duplicate normal master
  checkDuplicateCountryMaster(country: any, newCountry: any) {
    return new Promise((resolve, reject) => {
      if (country.find((c: any) => c.master.toLowerCase() == newCountry.master.toLowerCase() && c._id != newCountry._id)) {
        reject('duplicate master name')
      } else {
        resolve(true)
      }
    })
  }
  // todo check duplicate normal master

  async onClickEditCountryList(newLists: any, list: any, index: number, key: any) {
    console.log(this.newLists);
    if (key == 'province') {
      Swal.fire({
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'OK',
      }).then(r => {
        if (r.isConfirmed) {
          if (r.value != '') {
            this.newLists[index].name = r.value
          }

        }
      })
    }


    if (key == 'file') {
      Swal.fire({
        input: 'file',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'OK',
      }).then(r => {

        console.log(r.value);
        if (r.isConfirmed) {
          if (r.value != '') {
            this.editFile = r.value
            this.newLists[index].files = [{
              name: r.value.name,
              size: r.value.size,
              src: r.value
            }]
          }

        }
      })
    }

    if (key == 'analysisFee' || key == 'currency') {

      // <option value=""></option>
      const option: any = this.Currency.lists.map((c: any) => `<option value="${c}">${c}</option>`)
      console.log(option);

      const { value: formValues } = await Swal.fire({
        title: 'Multiple inputs',
        html:
          `<input id="swal-input1" class="swal2-input" placeholder="analysisFee" > 
          <select id="swal-input2" autocapitalize="off" class="swal2-select" >
                   ${option}
                </select> `,
        focusConfirm: false,
        preConfirm: () => {
          let input1: any = document.getElementById('swal-input1') as HTMLInputElement
          let input2: any = document.getElementById('swal-input2') as HTMLInputElement
          return [input1.value, input2.value]
        }
      })

      if (formValues) {
        this.newLists[index].quotation.analysisFee = Number(formValues[0])
        this.newLists[index].quotation.currency = formValues[1]
      }



    }



  }
  // ? --------------------------------------- update Country 

}
