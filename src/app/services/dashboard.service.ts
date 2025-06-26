import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as d from '../interfaces/dashboardData.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = "http://localhost:8080/ecipar_dashboard_prototype2_war_exploded/api/charts";

  constructor(private http: HttpClient) { }
 
  getRifiuti(){
    // Prova con un numero diverso, potrebbe essere un periodo di tempo o un limite
    return this.http.get<d.RifiutoResponse>(this.baseUrl + '/rifiuti/30');
  }

  getProduzione(){
    // Prova con un numero diverso, potrebbe essere un periodo di tempo o un limite
    return this.http.get<d.ProduzioneResponse>(this.baseUrl + '/produzione/30');
  }

  getProdotti(){
    return this.http.get<d.ProdottoResponse>(this.baseUrl + '/prodotti/10');
  }



}

