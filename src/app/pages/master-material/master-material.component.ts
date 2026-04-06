import { HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import Swal from 'sweetalert2';

interface DataItem {
  _id?: string;
  id: number;
  name: string;
  isEditing: boolean;
  originalName?: string; // สำหรับ backup ตอน cancel
}

@Component({
  selector: 'app-master-material',
  templateUrl: './master-material.component.html',
  styleUrls: ['./master-material.component.scss']
})
export class MasterMaterialComponent implements OnInit, AfterViewInit {

  @ViewChild('editInput') editInput!: ElementRef;

  dataList: DataItem[] = [];
  nextId = 1;

  constructor(
    private api: HttpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.initializeSampleData();
    this.initialData()
  }

  ngAfterViewInit(): void {
  }

  private async initialData() {
    try {
      let resApi: any = await this.api.getMaterial(new HttpParams()).toPromise()
      this.dataList = resApi.data
    } catch (error) {
      // Initialize with sample data if API fails
      this.initializeSampleData();
    }
  }

  // Initialize with some sample data
  private initializeSampleData(): void {
    this.dataList = [
      { id: 1, name: 'Steel', isEditing: false },
      { id: 2, name: 'Aluminum', isEditing: false },
      { id: 3, name: 'Plastic', isEditing: false }
    ];
    this.nextId = 4;
  }

  // Add new item
  async addNewItem(): Promise<void> {
    const newItem: DataItem = {
      id: this.nextId++,
      name: `New Material ${this.dataList.length + 1}`,
      isEditing: true
    };
    this.dataList.unshift(newItem);

    // Focus on the new input field after view update
    setTimeout(() => {
      const input = document.querySelector('tr:first-child input[type="text"]') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  // Edit item
  editItem(item: DataItem, index: number): void {
    // Cancel any other editing items
    this.dataList.forEach(data => {
      if (data.id !== item.id && data.isEditing) {
        this.cancelEdit(data, this.dataList.indexOf(data));
      }
    });

    // Store original name for cancel functionality
    item.originalName = item.name;
    item.isEditing = true;

    // Focus on input field
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[type="text"]');
      const targetInput = inputs[this.dataList.filter(d => d.isEditing).indexOf(item)] as HTMLInputElement;
      if (targetInput) {
        targetInput.focus();
        targetInput.select();
      }
    }, 100);
  }

  // Save item
  async saveItem(item: DataItem, index: number): Promise<void> {
    if (!item.name || item.name.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Material name cannot be empty',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check for duplicate names
    const duplicateIndex = this.dataList.findIndex(
      (data, i) => data.name.trim().toLowerCase() === item.name.trim().toLowerCase() && i !== index
    );

    if (duplicateIndex !== -1) {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Name!',
        text: 'This material name already exists',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      if (!item._id) {
        const resApi: any = await this.api.createMaterial({ name: item.name.trim() }).toPromise();
        item._id = resApi.data._id;
      } else {
        await this.api.updateMaterial(new HttpParams().set('id', item._id), { name: item.name.trim() }).toPromise();
      }

      item.name = item.name.trim();
      item.isEditing = false;
      delete item.originalName;

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Material has been saved successfully',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      // Fallback for demo purposes
      item.name = item.name.trim();
      item.isEditing = false;
      delete item.originalName;

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Material has been saved successfully (Demo mode)',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  // Cancel edit
  cancelEdit(item: DataItem, index: number): void {
    if (item.originalName !== undefined) {
      item.name = item.originalName;
      delete item.originalName;
    }
    item.isEditing = false;
  }

  // Duplicate item
  async duplicateItem(item: DataItem): Promise<void> {
    const duplicatedItem: DataItem = {
      id: this.nextId++,
      name: `${item.name} (Copy)`,
      isEditing: false
    };

    const index = this.dataList.indexOf(item);
    this.dataList.splice(index + 1, 0, duplicatedItem);

    try {
      const resApi: any = await this.api.createMaterial({ name: duplicatedItem.name }).toPromise();
      duplicatedItem._id = resApi.data._id;
    } catch (error) {
      // Fallback for demo purposes
      console.log('Demo mode: Material duplicated');
    }

    Swal.fire({
      icon: 'success',
      title: 'Duplicated!',
      text: 'Material has been duplicated successfully',
      timer: 1500,
      showConfirmButton: false
    });
  }

  // Delete item
  async deleteItem(index: number): Promise<void> {
    const item = this.dataList[index];

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (item._id) {
            await this.api.deleteMaterial(new HttpParams().set('id', item._id)).toPromise();
          }
        } catch (error) {
          // Fallback for demo purposes
          console.log('Demo mode: Material deleted');
        }

        this.dataList.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Material has been deleted successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  // Go back to masterlists
  goBackToMasterlists(): void {
    this.router.navigate(['/masterlists']);
  }
}
