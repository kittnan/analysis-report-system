import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preview-equipment',
  templateUrl: './preview-equipment.component.html',
  styleUrls: ['./preview-equipment.component.css']
})
export class PreviewEquipmentComponent implements OnInit {

  ChildModal: boolean
  DataModal: any
  @Input() fromParent
  constructor(
    public activeModal : NgbActiveModal
  ) { }

  ngOnInit(): void {
    console.log(this.fromParent);
    
  }
  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

}
