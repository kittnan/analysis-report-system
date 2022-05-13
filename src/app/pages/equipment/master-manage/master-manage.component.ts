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

  newItem: any

  MASTER: any
  Select_Master: any

  editItem: any
  tempEditItem: any

  editMaster: any
  tempEditMaster: any
  constructor(
    private md: NgbModal,
    // private api: EquipmentService,
    private middleAPI: MasterService
  ) {
  }

  async ngOnInit(): Promise<void> {
    // this.getMaster()
  }

  async onChangeGroupSelect(e: any) {
    this.Select_Master = ''
    const groupName = e.target.value
    if (groupName == 'country') {
      this.MASTER = await this.middleAPI.getCountry()
    }
    if (groupName == 'normal') {
      this.MASTER = await this.middleAPI.getMaster()
    }

  }


  onClickModalAddMaster(content: any) {
    this.group = ''
    this.master = ''
    this.lists = []
    this.md.open(content, { size: 'lg' })
  }

  addItem() {
    const trimNewItem = this.newItem.trim()
    if (this.lists.find(l => l == trimNewItem)) {
      Swal.fire('Duplicate list', '', 'error')
    } else {
      this.lists.push(trimNewItem)
      this.newItem = ''
    }
  }
  onClickDeleteList(index: number) {
    this.lists.splice(index, 1)
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

  onSave() {
    Swal.fire({
      title: 'Do you want to Save?',
      icon: 'question',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.insertMaster()
      }
    })
  }

  insertMaster() {

    if (this.group == 'country') {
      this.insertGroup()
    }
    if (this.group == 'normal') {
      this.insertNormal()
    }



  }
  async insertGroup() {
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


  // ? delete master
  onClickDeleteMaster() {

    if (this.Select_Master) {
      Swal.fire({
        title: ` Do you want to delete master: ${this.Select_Master.master}?`,
        icon: 'question',
        showCancelButton: true
      }).then(r => {
        if (r.isConfirmed) {
          this.deleteMaster(this.Select_Master._id)
        }
      })
    } else {
      Swal.fire('Please select master delete target!!', '', 'warning')
    }

  }
  async deleteMaster(id: any) {

    try {
      const resDelete: any = await this.middleAPI.deleteMaster(id)
      if (resDelete.deletedCount > 0) {
        this.ngOnInit()
        this.Select_Master = undefined
        Swal.fire('Success', '', 'success')
      } else {
        Swal.fire('Fail', '', 'error')
      }
    } catch (error) {

    }

  }

  // todo table

  onChangeMasterSelect(e: any) {
    this.Select_Master = this.MASTER.find(m => m.master == e.target.value)
    console.log(this.Select_Master);

  }
  onClickDeleteListTable(index: number) {
    Swal.fire({
      title: `Do you want to delete ${this.Select_Master.lists[index]}?`,
      icon: 'question',
      showCancelButton: true,
    }).then(r => {
      if (r.isConfirmed) {
        this.deleteListTable(index)
      }
    })
  }

  async deleteListTable(index: number) {
    try {
      this.Select_Master.lists.splice(index, 1)
      console.log(this.Select_Master);

      await this.middleAPI.updateMaster(this.Select_Master._id, this.Select_Master)
      this.ngOnInit()
      Swal.fire('Success', '', 'success')

    } catch (error) {

    }

  }

  onClickEditMasterTable(content: any) {
    this.editMaster = this.Select_Master.master
    this.md.open(content, { size: 'lg' })

  }

  onClickEditListTable(index: number, content: any) {
    console.log(index);
    this.tempEditItem = {
      index: index,
      data: this.Select_Master.lists[index]
    }
    this.editItem = this.Select_Master.lists[index]
    this.md.open(content, { size: 'lg' })
  }
  checkEditList() {
    if (this.editItem != '') {
      return false
    }
    return true
  }

  onEditListSave() {
    Swal.fire({
      title: 'Do you want to Save?',
      icon: 'question',
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        this.Select_Master.lists[this.tempEditItem.index] = this.editItem
        this.updateMaster()
      }
    })
  }

  async updateMaster() {
    try {
      await this.middleAPI.updateMaster(this.Select_Master._id, this.Select_Master)
      this.md.dismissAll()
    } catch (error) {

    }

  }

  onEditMasterSave() {
    Swal.fire({
      title: 'Do you want to edit master?',
      icon: 'question',
      showCancelButton: true
    }).then(async rr => {
      if (rr.isConfirmed) {
        try {
          this.Select_Master.master = this.editMaster
          await this.middleAPI.updateMaster(this.Select_Master._id, this.Select_Master)
          this.md.dismissAll()
          Swal.fire('Success', '', 'success')
        } catch (error) {
          console.log(error);
        }
      }
    })
  }

}
