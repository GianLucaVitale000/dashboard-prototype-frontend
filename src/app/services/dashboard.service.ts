import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as d from '../interfaces/dashboardData.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { }
 
  getRifiuti(){
    return this.http.get<d.RifiutoResponse>(this.baseUrl + '/rifiuti');
  }

  getProduzione(){
    return this.http.get<d.ProduzioneResponse>(this.baseUrl + '/produzione');
  }

  getProdotti(){
    return this.http.get<d.ProdottoResponse>(this.baseUrl + '/prodotti');
  }



}

