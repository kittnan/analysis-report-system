import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent, RowNode } from 'ag-grid-community';
import Swal from 'sweetalert2'
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { environment } from 'environments/environment';
import { AnalysisDataListComponent } from '../analysis-data-list/analysis-data-list.component';

// ? origin ที่ result.file ถูกบันทึกไว้ (ดู routes/main_fn/file.js -> pathEngReport)
const FILE_SERVER_ORIGIN = 'http://10.200.90.152:4501'
// ? จำนวนไฟล์ที่ download พร้อมกัน
const DOWNLOAD_CONCURRENCY = 5

interface ExportItem {
  requestNumber: string
  url: string
  fileName: string
}

@Component({
  selector: 'app-analysis-export-report',
  templateUrl: './analysis-export-report.component.html',
  styleUrls: ['../analysis-data-list/analysis-data-list.component.css']
})
export class AnalysisExportReportComponent extends AnalysisDataListComponent implements OnInit, OnDestroy {

  // ? export state
  exporting: boolean = false
  cancelRequested: boolean = false
  progressDone: number = 0
  progressTotal: number = 0
  failedItems: { requestNumber: string, fileName: string, reason: string }[] = []

  selectedCount: number = 0

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
    filter: true,
  }

  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'select',
      width: 50,
      filter: false,
      sortable: false,
      resizable: false,
      checkboxSelection: (p: any) => !!p.data?.file,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      headerName: 'Report File',
      colId: 'hasReport',
      width: 130,
      valueGetter: (p: any) => p.data?.file ? 'Have file' : 'No file',
      cellStyle: (p: any) => ({ color: p.value == 'Have file' ? 'green' : 'gray' }),
    },
    {
      field: 'statusShow',
      headerName: 'Status',
      cellStyle: (params: any) => {
        let color
        params.value == "Ongoing" ? color = "lightyellow" : false
        params.value == "Ongoing with delay" ? color = "orange" : false
        params.value == "Making report" ? color = "yellow" : false
        params.value == "Entering Analysis Results" ? color = "lightblue" : false
        params.value == "Done" ? color = "lightgreen" : false
        params.value == "Done with delay" ? color = "green" : false
        params.value == "Cancel" ? color = "lightgray" : false
        return { backgroundColor: color }
      },
    },
    { field: 'requestNumber', headerName: 'Reg No.' },
    { field: 'analysisReportNo', headerName: 'Report No.' },
    { field: 'ktcModelNumber', headerName: 'KTC Model Number' },
    { field: 'customer', headerName: 'Customer' },
    { field: 'defectiveName', headerName: 'Defect Name' },
    { field: 'pcLotNumber', headerName: 'Lot Number' },
    { field: 'issueDate', filter: false, headerName: 'Issue Date' },
    { field: 'finishReportDate', filter: false, headerName: 'Finish Analysis Report Date' },
    {
      headerName: 'File Name',
      colId: 'fileName',
      valueGetter: (p: any) => p.data?.file ? this.getFileName(p.data.file) : '',
    },
  ];

  async ngOnInit(): Promise<void> {
    // ? ไม่ใช้ interval setFilter ของหน้า data list (คนละ column)
    this.CheckStatusUser();
    this.GetModelAll();
    this.loadDataFromSessionCondition()
    this.holidays = await this.getHoliday()
  }

  // ? เปิดให้ user ทุก level ที่ login แล้วใช้ได้ (ไม่จำกัดเฉพาะ Analysis/Admin เหมือนหน้า data list)
  CheckStatusUser() {
    if (!localStorage.getItem('AR_UserEmployeeCode')) {
      this.route.navigate(['/login'])
    }
  }

  ngOnDestroy(): void {
    this.cancelRequested = true
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSelectionChanged() {
    this.selectedCount = this.gridApi ? this.gridApi.getSelectedRows().length : 0
  }

  onCellClicked(item: any) {
    if (item.column?.getColId() == 'select') return
    const form = item.data
    const url = `#/viewForm?formId=${form.FormId}&formView=2`
    window.open(url, '_blank');
  }

  // ? จำนวนแถวที่มีไฟล์ (หลัง filter ของตาราง)
  countFilteredWithFile() {
    if (!this.gridApi) return 0
    let count = 0
    this.gridApi.forEachNodeAfterFilter((node: RowNode) => node.data?.file ? count++ : false)
    return count
  }

  // ? เลือกแถวที่ติ๊กไว้ ถ้าไม่ได้ติ๊กเลยใช้ทุกแถวหลัง filter
  private getExportRows(): any[] {
    const selected = this.gridApi.getSelectedRows()
    if (selected.length > 0) return selected.filter((r: any) => !!r.file)
    const rows: any[] = []
    this.gridApi.forEachNodeAfterFilter((node: RowNode) => node.data?.file ? rows.push(node.data) : false)
    return rows
  }

  async onClickExportFiles() {
    if (!this.gridApi || this.exporting) return
    const rows = this.getExportRows()
    if (rows.length == 0) {
      Swal.fire({ icon: 'warning', title: 'Warning !', text: 'No report file to export' })
      return
    }

    const confirm = await Swal.fire({
      title: `Export ${rows.length} report file(s) ?`,
      text: this.selectedCount > 0 ? 'Export selected rows' : 'Export all filtered rows',
      icon: 'question',
      showCancelButton: true,
    })
    if (!confirm.isConfirmed) return

    const items = this.buildExportItems(rows)

    this.exporting = true
    this.cancelRequested = false
    this.progressDone = 0
    this.progressTotal = items.length
    this.failedItems = []

    try {
      const zip = new JSZip()
      await this.downloadAll(items, zip)

      if (this.cancelRequested) {
        Swal.fire({ icon: 'info', title: 'Export cancelled', showConfirmButton: false, timer: 1500 })
        return
      }

      const successCount = items.length - this.failedItems.length
      if (successCount == 0) {
        Swal.fire({ icon: 'error', title: 'Export failed', text: 'Cannot download any file' })
        return
      }

      if (this.failedItems.length > 0) {
        const text = this.failedItems.map(f => `${f.requestNumber}\t${f.fileName}\t${f.reason}`).join('\r\n')
        zip.file('_failed_files.txt', text)
      }

      // ? PDF / Office เป็นไฟล์บีบอัดอยู่แล้ว ใช้ STORE ให้เร็ว
      const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' })
      FileSaver.saveAs(blob, await this.buildZipName())

      Swal.fire({
        icon: this.failedItems.length > 0 ? 'warning' : 'success',
        title: 'Export finished',
        text: `Success ${successCount} / ${items.length} file(s)` +
          (this.failedItems.length > 0 ? ` (failed ${this.failedItems.length}, see _failed_files.txt)` : ''),
      })
    } catch (error) {
      console.log(error);
      Swal.fire({ icon: 'error', title: 'Export failed', text: `${error}` })
    } finally {
      this.exporting = false
    }
  }

  onCancelExport() {
    this.cancelRequested = true
  }

  private buildExportItems(rows: any[]): ExportItem[] {
    const usedNames = new Set<string>()
    return rows.map((row: any) => {
      const original = this.getFileName(row.file) || `${row.requestNumber}`
      let name = original
      if (usedNames.has(name.toLowerCase())) {
        name = `${row.requestNumber}_${original}`
      }
      let n = 1
      const dot = name.lastIndexOf('.')
      const base = dot > 0 ? name.slice(0, dot) : name
      const ext = dot > 0 ? name.slice(dot) : ''
      while (usedNames.has(name.toLowerCase())) {
        name = `${base}(${n++})${ext}`
      }
      usedNames.add(name.toLowerCase())
      return { requestNumber: row.requestNumber, url: this.toDownloadUrl(row.file), fileName: name }
    })
  }

  private async downloadAll(items: ExportItem[], zip: JSZip) {
    let index = 0
    const worker = async () => {
      while (index < items.length && !this.cancelRequested) {
        const item = items[index++]
        try {
          const res = await fetch(item.url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          zip.file(item.fileName, await res.blob())
        } catch (error) {
          this.failedItems.push({ requestNumber: item.requestNumber, fileName: item.fileName, reason: `${error?.message || error}` })
        } finally {
          this.progressDone++
        }
      }
    }
    const workers = []
    for (let i = 0; i < Math.min(DOWNLOAD_CONCURRENCY, items.length); i++) {
      workers.push(worker())
    }
    await Promise.all(workers)
  }

  // ? file server :4501 ไม่มี CORS header -> download ผ่าน backend /FileDownload แทน
  toDownloadUrl(file: string) {
    try {
      const u = new URL(file, window.location.href)
      if (u.origin == FILE_SERVER_ORIGIN) {
        return `${environment.UrlApi}/FileDownload?path=${encodeURIComponent(decodeURIComponent(u.pathname))}`
      }
      return u.href
    } catch (error) {
      return file
    }
  }

  getFileName(file: string) {
    if (!file) return ''
    const last = file.split('?')[0].split('/').pop() || ''
    try {
      return decodeURIComponent(last)
    } catch (error) {
      return last
    }
  }

  private async buildZipName() {
    const modelName: any = await this.setModelName()
    const dateStart = this.DateStart.valid ? this.DateStart.value : 'Previous'
    const dateEnd = this.DateEnd.valid ? this.DateEnd.value : 'Now'
    const period = this.Month.valid ? this.Month.value : `${dateStart}_${dateEnd}`
    return `Report_${modelName}_${period}.zip`
  }

  get progressPercent() {
    return this.progressTotal ? Math.round(this.progressDone / this.progressTotal * 100) : 0
  }
}
