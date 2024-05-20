import { DashboardService } from './../../services/dashboard.service';
import { HighchartsChartModule } from 'highcharts-angular';
import { Component } from '@angular/core';
import Highcharts from 'highcharts';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Produzione } from '../../interfaces/dashboardData.interface';
import { firstValueFrom } from 'rxjs';

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
export class DashboardComponent {
 Highcharts: typeof Highcharts = Highcharts;
 

 //RIFIUTI
 rifiutiChartOptions!: Highcharts.Options;

 //PRODUZIONE
 produzioni: Map<string, Produzione[]> = new Map();
 produzioneOptions: ProduzioneOption[] = [];
 selectedProduzione!: ProduzioneOption;
 produzioneChartOptions!: Highcharts.Options;

  constructor(private service: DashboardService) {}

  ngOnInit() {
this._getRifiuti();
this._getProduzione();
  }
  
onProduzioneChange() {
  this._setProduzioneChart(this.selectedProduzione.code);
  }
  
  private _getRifiuti() {
    const rifiuti$ = this.service.getRifiuti();
    const rifiuti = firstValueFrom(rifiuti$);

    rifiuti.then((rf) => {
      const data = rf.series[0].data.map((r) => ({
        name: r.tipo,
        y: r.quantita,
      }));
      this.rifiutiChartOptions = {
        chart: {
          type: 'pie',
        },
        title: {
          text: 'Rifiuti',
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            },
          },
        },
        series: [
          {
            type: 'pie',
            name: 'Rifiuti',
            data,
          },
        ],
      };
    });
  }

  private _getProduzione() {
    const prod$ = this.service.getProduzione();
    prod$.subscribe((p) => {
      for (const s of p.series) {
        this.produzioneOptions.push({ name: s.label, code: s.label });
        this.produzioni.set(s.label, s.data);
      }

      this.selectedProduzione = this.produzioneOptions[0];
      this._setProduzioneChart(this.selectedProduzione.code);
    });
  }

  private _setProduzioneChart(label: string) {
    let data = this.produzioni.get(label);
    if (!data) {
      return;
    }

    const pezziProdotti = data.map((p) => p.pezziProdotti);
    const pezziDifettosi = data.map((p) => p.pezziDifettosi);
    const date = data.map((p) => p.data);

    this.produzioneChartOptions = {
      chart: {
        type: 'line',
      },
      title: {
        text: label,
      },
      xAxis: {
        categories: date,
      },
      series: [
        {
          type: 'line',
          name: 'Pezzi Prodotti',
          data: pezziProdotti,
        },
        {
          type: 'line',
          name: 'Pezzi Difettosi',
          data: pezziDifettosi,
        },
      ],
    };
  }


}

