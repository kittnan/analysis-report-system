import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelperMasterFMService {

  constructor(
    private api: HttpService
  ) { }

  async getMaster() {
    let fmPositions = await this.api.getFMPosition(new HttpParams).toPromise()
    let materials = await this.api.getMaterial(new HttpParams).toPromise()
    let estimateResultProcess = await this.api.getEstimateResultProcess(new HttpParams).toPromise()
    if (fmPositions && fmPositions.data.length != 0) {
      fmPositions = fmPositions.data
    }
    if (materials && materials.data.length != 0) {
      materials = materials.data
    }
    if (estimateResultProcess && estimateResultProcess.data.length != 0) {
      estimateResultProcess = estimateResultProcess.data
    }
    return {
      fmPositions: fmPositions || [],
      materials: materials || [],
      estimateResultProcess: estimateResultProcess || []
    }
  }
}
