import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../master-manage/master.service';
import { PreviewEquipmentComponent } from '../preview-equipment/preview-equipment.component';

@Component({
  selector: 'app-equipment-home',
  templateUrl: './equipment-home.component.html',
  styleUrls: ['./equipment-home.component.css']
})
export class EquipmentHomeComponent implements OnInit {

  Equipment: any
  equipmentSelected: any

  equipmentChemistry: any
  equipmentElectronic: any
  constructor(
    private middleAPI: MasterService,
    private modal: NgbModal
  ) { }

  async ngOnInit(): Promise<void> {
    const equipment = await this.middleAPI.getEquipment()
    const master: any = await this.middleAPI.getMaster()
    const tempField = master.filter((m: any) => m.master.toLowerCase().includes('field'))
    const field = tempField[0].lists
    console.log(field);
    this.Equipment = await this.splitField(field, equipment)
    console.log(this.Equipment);
    
    // this.equipmentChemistry = this.Equipment.filter((e: any) => e.field.toLowerCase().includes('chemistry'))
    // this.equipmentElectronic = this.Equipment.filter((e: any) => e.field.toLowerCase().includes('electronic'))


  }

  splitField(field: any, equipment: any) {
    return new Promise(resolve => {
      resolve(
        field.map((f: any) => {
          const result = {
            data: equipment.filter((e: any) => e.field.toLowerCase().includes(f.toLowerCase())),
            name: f
          }
          return result
        })
      )
    })
  }

  openModalEquipment(content: any, item: any) {
    console.log('item', item);
    this.equipmentSelected = item
    this.modal.open(content, { size: 'xl' })
  }

  // todo click row
  openModal(item) {
    const modalRef = this.modal.open(PreviewEquipmentComponent, { size: 'xl' })
    modalRef.componentInstance.fromParent = item
  }
  // todo click row

}
