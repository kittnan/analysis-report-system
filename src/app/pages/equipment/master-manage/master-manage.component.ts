import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentService } from 'app/service/equipment.service';
import { timeStamp } from 'console';
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

  editItem: any

  constructor(
    private md: NgbModal,
    // private api: EquipmentService,
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
  // ? --------------------------------- table


  // ? --------------------------------- option

  checkTable() {
    if (this.Select_Master && this.Select_Master.lists != undefined) {
      return true
    }
    return false
  }

  // todo update master
  async updateMaster(body: any, group: string) {
    try {

      switch (group) {
        case 'country':
          await this.middleAPI.updateCountry(body._id, body)
          break;
        case 'normal':
          await this.middleAPI.updateMaster(body._id, body)
          break;
      }
      this.md.dismissAll()
    } catch (error) {
      console.log(error);
    } finally {
      Swal.fire('Success', '', 'success')
    }

  }
  // todo update master

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

        this.Select_Master = undefined
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


  // todo modal

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
      title: 'Do you want to Save?',
      icon: 'question',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        if (key == 'insert') {
          this.insertMaster()
        } else if (key == 'update') {
          console.log(this.group, this.Select_Master.group);
          if (this.group != this.Select_Master.group) {
            this.onSwapGroup()
          } else {
            this.updateMaster(this.Select_Master, this.group)
          }

        }
      }
    })
  }

  async onSwapGroup() {
    try {
      switch (this.group) {
        case 'country':
          // this.insertCountry()
          await this.middleAPI.insertCountry(this.Select_Master)
          await this.middleAPI.deleteMaster(this.Select_Master._id)
          this.callMasterName()

          break;
        case 'normal':
          // this.insertNormal()
          await this.middleAPI.insertMaster(this.Select_Master)
          await this.middleAPI.deleteCountry(this.Select_Master._id)
          this.callMasterName()

          break;
      }
      this.md.dismissAll()
      Swal.fire('Success', '', 'success')

    } catch (error) {
      console.log(error);

    }

  }



  insertMaster() {

    if (this.group == 'country') {
      this.insertCountry()
    }
    if (this.group == 'normal') {
      this.insertNormal()
    }



  }
  async insertCountry() {
    try {
      let data: EquipmentMasterForm = {
        master: this.master,
        lists: this.lists
      }
      const master: any = await this.middleAPI.getCountry()
      if (master.find(m => m.master == this.master)) {
        Swal.fire('Duplicate master', '', 'error')
      } else {
        await this.middleAPI.insertCountry(data)
        this.md.dismissAll()
        this.MASTER = await this.middleAPI.getCountry()
        Swal.fire('Success', '', 'success')
      }

    } catch (error) {
      console.log(error);
    }
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

  // todo modal

  // ? --------------------------------- option




}
