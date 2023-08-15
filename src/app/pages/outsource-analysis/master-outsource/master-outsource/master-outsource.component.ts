import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';
import { TestObject } from 'protractor/built/driverProviders';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-outsource',
  templateUrl: './master-outsource.component.html',
  styleUrls: ['./master-outsource.component.css']
})
export class MasterOutsourceComponent implements OnInit {

  constructor(
    private md: NgbModal,
    private api: HttpService,
    private route: Router
  ) { }
  //-----------------------------------------------------------------------------------------//
  RouterMenu: any[]
  listMaster: any[]
  listMasters: any
  masterName: any
  ModalListName: any
  ModalCheck: any
  ModalNum: any
  data_CauseOfDefective: any
  data_MakerSupplierName: any
  CauseOfDefective: any
  MakerSupplierName: any
  addMaster: any
  listName: any
  onAdd: any

  // ? new Toggle Func
  ToggleNormalTable: boolean = false


  //-----------------------------------------------------------------------------------------//
  ngOnInit(): void {
    const access: any = localStorage.getItem('AR_UserEmployeeCode')
    if (access == 'admin') {
      this.RouterMenu = [
        {
          path: '/searchDatabase', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
        {
          path: '/outsource', title: 'Input Database', icon: 'bi bi-search'
        },
        {
          path: '/MasterOutsource', title: 'Master Outsource', icon: 'bi bi-search'
        },
      ]
    } else {
      this.RouterMenu = [
        {
          path: '/searchDatabase', title: 'SEARCH DATABASE', icon: 'bi bi-house'
        },
        {
          path: '/outsource', title: 'Input Database', icon: 'bi bi-search'
        },
        // {
        //   path: '/MasterOutsource', title: 'Master Outsource', icon: 'bi bi-search'
        // },

      ]
    }
    this.masterList()

  }

  //-----------------------------------------------------------------------------------------//
  async masterList() {
    this.listMaster = await this.api.getDataAllMaster().toPromise()
  }


  onSelectCauseModel() {
    if (this.masterName == this.listMaster[0].name) {
      this.ToggleNormalTable = true
      this.listMasters = this.listMaster[0].list
    } else if (this.masterName == this.listMaster[1].name) {
      this.listMasters = this.listMaster[1].list
      this.ToggleNormalTable = true
    } else {
      this.ToggleNormalTable = false
    }
    // console.log(this.listMaster);

  }
  ModalEditList(content, item, i) {
    this.ModalListName = item
    this.ModalCheck = item
    this.ModalNum = i
    this.md.open(content, { size: 'lg' });
  }

  async setEdit() {
    Swal.fire({
      title: `Do you want to edit ?`,
      icon: 'warning',
      showCancelButton: true
    }).then(ans => {
      if (ans.isConfirmed) {
        this.listMasters[this.ModalNum] = this.ModalListName
        setTimeout(async () => {
          Swal.fire('Success', '', 'success')
          await this.updateMasterOutsource()
          await this.masterList()
          // console.log(this.listMaster);
        }, 200);
      }
    })
  }

  onDeleteList(item: any) {
    Swal.fire({
      title: `Do you want to delete ${item}?`,
      icon: 'warning',
      showCancelButton: true
    }).then(ans => {
      if (ans.isConfirmed) {
        this.listMasters = this.listMasters.filter((f: any) => f != item);
        setTimeout(async () => {
          Swal.fire('Success', '', 'success')
          await this.updateMasterOutsource()
          await this.masterList()
        }, 200);
      }
    })

  }

  // updateMasterOutsource
  async updateMasterOutsource() {
    if (this.masterName == this.listMaster[0].name) {
      this.CauseOfDefective = this.listMasters
      // console.log(this.CauseOfDefective);
      this.data_CauseOfDefective = {
        name: "Defective Part",
        list: this.CauseOfDefective
        // list: ["LCD/TFT Panel", "LSI", "PWB", "Backlight", "Polarizer", "FPC", "Touch panel", "ACF Tape", "Conductive tape", "Conductive /Carbon paste", "Adhesive gule", "Resin", "OCA glue"],
      }
      await this.api.updateMasterOutsource(environment.MasterCauseOfDefective, this.data_CauseOfDefective).toPromise()
    } else if (this.masterName == this.listMaster[1].name) {
      this.MakerSupplierName = this.listMasters
      // console.log(this.MakerSupplierName);
      this.data_MakerSupplierName = {
        name: "Maker/Supplier Name",
        list: this.MakerSupplierName
        // list: ["Himax", "PTC", "Rohm", "KC-DC", "SKC", "HDK"]
      }
      await this.api.updateMasterOutsource(environment.MasterMakerSupplierName, this.data_MakerSupplierName).toPromise()
    }
  }


  // test() {
  //   console.log(this.addMaster);
  //   console.log(this.listName);

  // }


  OpenModalAddList(content) {
    this.md.open(content, { size: 'lg' });
  }


  ModalAddList() {
    // console.log(this.addMaster);
    // console.log(this.listMaster);
    // console.log(this.listMaster[0].name);
    Swal.fire({
      title: `Do you want to add master ${this.listName}?`,
      icon: 'warning',
      showCancelButton: true
    }).then(async ans => {
      if (ans.isConfirmed) {
        if (this.addMaster == this.listMaster[0].name) {
          this.listMaster[0].list.push(this.listName)
          this.data_CauseOfDefective = {
            name: "Defective Part",
            list: this.listMaster[0].list
          }
          await this.api.updateMasterOutsource(environment.MasterCauseOfDefective, this.data_CauseOfDefective).toPromise()

        } else if (this.addMaster == this.listMaster[1].name) {
          this.listMaster[1].list.push(this.listName)
          this.data_MakerSupplierName = {
            name: "Maker/Supplier Name",
            list: this.listMaster[1].list
          }
          await this.api.updateMasterOutsource(environment.MasterMakerSupplierName, this.data_MakerSupplierName).toPromise()

        }
        setTimeout(async () => {
          Swal.fire('Success', '', 'success')
          // await this.updateMasterOutsource()
          // await this.masterList()
        }, 200);
      }
    })

  }

  check() {
    if (this.addMaster == this.listMaster[0].name) {
      this.onAdd = this.listMaster[0].list.find((l: any) => l.toLowerCase() == this.listName.toLowerCase())
    }
    if (this.addMaster == this.listMaster[1].name) {
      this.onAdd = this.listMaster[1].list.find((l: any) => l.toLowerCase() == this.listName.toLowerCase())
    }

    //

  }

  // Cause of Defective
  // Maker/Supplier Name
}
