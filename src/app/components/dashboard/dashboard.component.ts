import { DashboardService } from './../../services/dashboard.service';
import { HighchartsChartModule } from 'highcharts-angular';
import { Component, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import Highcharts3D from 'highcharts/highcharts-3d';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Produzione } from '../../interfaces/dashboardData.interface';
import { firstValueFrom } from 'rxjs';

// Initialize Highcharts modules
HighchartsMore(Highcharts);
Highcharts3D(Highcharts);

// Imposta opzioni globali per Highcharts
Highcharts.setOptions({
  lang: {
    thousandsSep: '.'
  },
  colors: [
    '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
    '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'
  ]
});

interface ProduzioneOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HighchartsChartModule, DropdownModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
 Highcharts: typeof Highcharts = Highcharts;
 
 // Flag per forzare l'aggiornamento dei grafici
 updateFlag: boolean = false;
 
 //RIFIUTI
 rifiutiChartOptions!: Highcharts.Options;

 //PRODUZIONE
 produzioni: Map<string, Produzione[]> = new Map();
 produzioneOptions: ProduzioneOption[] = [];
 selectedProduzione!: ProduzioneOption;
 produzioneChartOptions!: Highcharts.Options;

 //PRODOTTI
 prodottiChartOptions!: Highcharts.Options;

  constructor(private service: DashboardService) {}

  ngOnInit() {
    this._getRifiuti();
    this._getProduzione();
    this._getProdotti();
  }
  
onProduzioneChange() {
  this._setProduzioneChart(this.selectedProduzione.code);
  }
  
  private _getRifiuti() {
    this.service.getRifiuti().subscribe((rf) => {
      console.log('Dati rifiuti ricevuti:', rf);
      
      // Define fixed colors for the pie slices
      const colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
                       '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
      
      let dataToUse: any[] = [];
      
      if (rf.series && rf.series.length > 0 && rf.series[0].data && rf.series[0].data.length > 0) {
        console.log('Usando dati dal backend per rifiuti');
        dataToUse = rf.series[0].data.map((r, index) => ({
          name: r.tipo,
          y: typeof r.quantita === 'number' ? r.quantita : parseFloat(r.quantita),
          color: colors[index % colors.length]
        }));
      } else {
        console.log('Attenzione: Nessun dato valido ricevuto per i rifiuti');
        // Non generiamo più dati casuali, mostriamo un grafico vuoto
        dataToUse = [];
      }
      
      console.log('Dati rifiuti usati:', dataToUse);
      
      this.rifiutiChartOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Rifiuti',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          name: 'Rifiuti',
          type: 'pie',
          data: dataToUse
        }] as any
      };

      // Forza l'aggiornamento del grafico
      this.updateFlag = true;
    });
  }

  private _getProduzione() {
    this.service.getProduzione().subscribe((p) => {
      console.log('Dati produzione ricevuti:', p);
      
      this.produzioneOptions = [];
      this.produzioni.clear();
      
      if (p.series && p.series.length > 0) {
        console.log('Elaborazione dati produzione dal backend');
        let datiValidiTrovati = false;
        
        for (const s of p.series) {
          if (s.data && s.data.length > 0) {
            datiValidiTrovati = true;
            this.produzioneOptions.push({ name: s.label, code: s.label });
            this.produzioni.set(s.label, s.data);
          }
        }
        
        if (!datiValidiTrovati) {
          console.log('Attenzione: Nessun dato valido trovato per la produzione');
        }
      } else {
        console.log('Attenzione: Struttura dati produzione non valida o vuota');
      }
      
      console.log('Opzioni produzione generate:', this.produzioneOptions);
      console.log('Map produzione generata:', this.produzioni);

      if (this.produzioneOptions.length > 0) {
        this.selectedProduzione = this.produzioneOptions[0];
        setTimeout(() => {
          this._setProduzioneChart(this.selectedProduzione.code);
        }, 100);
      }
    });
  }

  private _setProduzioneChart(label: string) {
    let data = this.produzioni.get(label);
    if (!data) {
      console.log('Nessun dato trovato per la label:', label);
      return;
    }

    console.log('Dati per la produzione:', data);

    const pezziProdotti = data.map((p) => {
      console.log('Pezzo prodotto valore:', p.pezziProdotti, 'tipo:', typeof p.pezziProdotti);
      // Se è già un numero, lo usiamo direttamente
      return typeof p.pezziProdotti === 'number' ? p.pezziProdotti : parseFloat(p.pezziProdotti);
    });
    const pezziDifettosi = data.map((p) => {
      console.log('Pezzo difettoso valore:', p.pezziDifettosi, 'tipo:', typeof p.pezziDifettosi);
      // Se è già un numero, lo usiamo direttamente
      return typeof p.pezziDifettosi === 'number' ? p.pezziDifettosi : parseFloat(p.pezziDifettosi);
    });
    const date = data.map((p) => p.data);

    console.log('Pezzi prodotti:', pezziProdotti);
    console.log('Pezzi difettosi:', pezziDifettosi);
    console.log('Date:', date);

    this.produzioneChartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: label,
      },
      xAxis: {
        categories: date
      },
      yAxis: {
        title: {
          text: 'Quantità'
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: true
        }
      },
      series: [{
        name: 'Pezzi Prodotti',
        type: 'line',
        data: pezziProdotti
      }, {
        name: 'Pezzi Difettosi',
        type: 'line',
        data: pezziDifettosi
      }] as any
    };

    console.log('Opzioni del grafico di produzione impostate:', this.produzioneChartOptions);
    
    // Forza l'aggiornamento del grafico
    this.updateFlag = true;
  }

  private _getProdotti() {
    this.service.getProdotti().subscribe((p) => {
      const nomi = p.series[0].data.map((prod) => prod.nome);
      const prezzi = p.series[0].data.map((prod) => prod.prezzo);
      
      this.prodottiChartOptions = {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Prodotti'
        },
        xAxis: {
          categories: nomi,
          title: {
            text: 'Prodotti'
          }
        },
        yAxis: {
          title: {
            text: 'Prezzo (€)'
          }
        },
        colors: ['#90ed7d'],
        series: [
          {
            type: 'bar',
            name: 'Prezzo',
            data: prezzi
          } as any
        ]
      };
      
      // Forza l'aggiornamento del grafico
      this.updateFlag = true;
    });
  }
}

