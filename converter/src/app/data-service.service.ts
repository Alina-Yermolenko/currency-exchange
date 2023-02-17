import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  async getInitialData(){
    const response = await fetch('http://www.floatrates.com/daily/usd.json',{
      method:'GET',
    })
    const result = await response.json();
    
    return result;
  }
}
