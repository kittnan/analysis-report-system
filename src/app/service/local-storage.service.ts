import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  clearLocal() {
    for (const key in localStorage) {
      if (key.includes('AR_')) {
        localStorage.removeItem(key)
      } else {

      }
    }
  }
}
