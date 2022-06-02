import { Injectable } from '@angular/core';
import * as Excel from "exceljs";
import { saveAs } from 'file-saver';
import { MasterService } from './master-manage/master.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ExportFilteredService {

  Country: any
  constructor(
    private middleAPI: MasterService
  ) { }

  async onGenReport(data: any) {



    Swal.fire({
      title: 'Generating report!',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    // console.log(data);
    const country: any = await this.middleAPI.getCountry()
    this.Country = country
    const workBook: Excel.Workbook = new Excel.Workbook()
    const workBook_config: any = await this.setConfigWorkbook(workBook)
    const worksheet: Excel.Worksheet = workBook.addWorksheet('Matrix')
    worksheet.views = [
      { state: 'frozen', xSplit: 2, activeCell: 'A1' }
    ];
    const sheetConfig: any = await this.sheetConfig(workBook_config, worksheet, data)
    // console.log('sheetConfig', sheetConfig);
    const workBook_setRow: any = await this.setRow(sheetConfig, worksheet, data)
    await this.setStyle(worksheet)


    const buffer = await workBook_setRow.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    })
    let fileName = new Date().toLocaleString()
    saveAs.saveAs(blob, fileName)
    setTimeout(() => {
      Swal.close()
    }, 1500);
  }

  private setConfigWorkbook(workBook: Excel.Workbook) {
    return new Promise(resolve => {
      workBook.creator = 'system';
      workBook.lastModifiedBy = 'system';
      workBook.created = new Date();
      workBook.modified = new Date();
      workBook.lastPrinted = new Date();
      resolve(workBook)
    })
  }

  private sheetConfig(workBook: Excel.Workbook, workSheet: Excel.Worksheet, data: any) {
    return new Promise(resolve => {
      // const rowValues = ['No', 'Analysis equipment name', 'Field', 'Analysis scope', 'Defect mode', 'Limitation of sample'];
      const r1 = ['', '', '', '', '', '',]
      const r2 = ['No', 'Analysis equipment name', 'Field', 'Analysis scope', 'Defect mode', 'Limitation of sample']
      let temp1: any[] = [r1, r2]
      this.Country.map((country: any) => {
        let h1: any[] = []
        let h2: any[] = []
        country.lists.map(l => h1.push(country.master))
        country.lists.map(l => h2.push(l.name))
        temp1[0] = temp1[0].concat(h1)
        temp1[1] = temp1[1].concat(h2)
        console.log(temp1);
      })
      workSheet.insertRow(5, temp1[0]);
      workSheet.insertRow(6, temp1[1]);

      resolve(workBook)
    })
  }

  private setRow(workBook: Excel.Workbook, worksheet: Excel.Worksheet, data: any) {
    return new Promise(resolve => {
      const temp: any = data.map((d: any, index: number) => {
        const dCountry: any = d.province.reduce((prev, now) => {
          const newMap: any = now.lists.map((list: any) => {
            return {
              master: now.master,
              name: list.name
            }
          })
          return prev.concat(newMap)
        }, [])

        let defect = d.defectMode.reduce((prev, now) => {
          if (prev == '') {
            return prev + now
          } else {
            return prev + ', ' + now
          }
        }, '')
        return [
          index + 1, d.analysisEquipmentName, d.field, d.analysisScope, defect, d.limitationOfSample, ...this.setCountry(dCountry)
        ]
      })

      worksheet.addRows(temp)
      resolve(workBook)
    });
  }
  private setCountry(dCountry: any) {

    const foo = this.Country.reduce((prev, now) => {

      const temp = now.lists.map(l => {
        if (dCountry.find(d1 => d1.name == l.name)) {
          return 'X'
        } else {
          return 'C'
        }
      })
      return prev.concat(temp)
    }, [])
    return foo
  }

  private setStyle(workSheet: Excel.Worksheet) {
    return new Promise(resolve => {
      const refCountry: any = this.Country.map(c => {
        return {
          master: c.master,
          len: c.lists.length,
          do: false,
          list: c.lists
        }
      })

      workSheet.eachRow((row: Excel.Row, rowNumber: number) => {
        workSheet.getRow(5).height = 20
        row.eachCell((Cell: Excel.Cell, colNumber: number) => {

          if (rowNumber === 5) {
            this.setHeadMaster(workSheet, row, rowNumber, Cell, colNumber, refCountry)
          } else {
            Cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          }


          if (rowNumber == 6) {

            if (colNumber >= 1 && colNumber <= 6) {
              Cell.style = {
                fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'f9eb7f' },
                }
              }
              Cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              }
            }

          }


          if (Cell.value == 'X') {
            Cell.value = '✓'
            Cell.style = {
              alignment: {
                horizontal: 'center',
                vertical: 'middle'
              }
            }
            Cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          }
          if (Cell.value == 'C') {
            Cell.value = ''

            Cell.style = {
              alignment: {
                horizontal: 'center',
                vertical: 'middle'
              },
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'a09b9b' },
              }
            }
            Cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          }

          this.setColWidth(workSheet, colNumber, Cell)

          if (rowNumber == 6 && colNumber > 6) {
            this.setItemHeadColor(workSheet, row, rowNumber, Cell, colNumber, refCountry)
          }

        })
      })


      resolve(workSheet)
    })
  }

  private setHeadMaster(workSheet: Excel.Worksheet, row: Excel.Row, rowNumber: number, Cell: Excel.Cell, colNumber: number, refCountry: any) {

    let findResult = refCountry.find(c => c.master == Cell.value)
    if (findResult && findResult.do == false) {

      const index: number = refCountry.indexOf(findResult)
      findResult.do = true
      workSheet.mergeCells(rowNumber, colNumber, rowNumber, (colNumber + findResult.len) - 1)
      Cell.style = {
        alignment: {
          horizontal: 'center',
          vertical: 'middle'
        },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.getRandomColor(index) },
        }
      }

    }
  }


  private getRandomColor(index: number) {
    const colors = ['B4FF9F', 'E4AEC5', 'FFD59E', 'FFA1A1', '82A284', '82A284', 'E4AEC5', 'FFC4DD', '8479E1', '8479E1', 'B4ECE3', 'FFF8D5', 'C4DDFF', '7FB5FF', 'FEE2C5']
    const numRan = Math.floor(Math.random() * (14 - 0 + 1) + 0)
    return colors[index];
  }

  setColWidth(worksheet: Excel.Worksheet, colNumber: number, Cell: Excel.Cell) {
    if (colNumber == 1) {
      worksheet.getColumn(colNumber).width = 5
    }
    if (colNumber == 2) {
      worksheet.getColumn(colNumber).width = 25
    }
    if (colNumber == 3) {
      worksheet.getColumn(colNumber).width = 10
    }
    if (colNumber == 4) {
      worksheet.getColumn(colNumber).width = 60
    }
    if (colNumber == 5) {
      worksheet.getColumn(colNumber).width = 60
    }
    if (colNumber == 6) {
      worksheet.getColumn(colNumber).width = 60
    }
    if (colNumber >= 7) {
      worksheet.getColumn(colNumber).width = 15
    }
  }

  setItemHeadColor(workSheet: Excel.Worksheet, row: Excel.Row, rowNumber: number, Cell: Excel.Cell, colNumber: number, refCountry: any) {
    const resultFind: any = refCountry.find(ref => ref.list.find(l => l.name == Cell.value))
    if (resultFind) {
      const index = refCountry.findIndex(object => {
        return object.list === resultFind.list;
      });
      console.log(index);

      Cell.style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.getRandomColor(index) },
        }
      }
      Cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }

      workSheet.getCell(rowNumber - 1, colNumber).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  }


}
