import { Component } from '@angular/core';
import { Prodotto } from '../../interfaces/dashboardData.interface';
import { DashboardService } from '../../services/dashboard.service';
import { TableModule} from 'primeng/table'

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {
  prodotti: Prodotto[] = [];
  prodottiColumns: { header: string; field: string}[] = [];

  constructor(private service: DashboardService) {}

  ngOnInit(){
    this._getProdotti();
  }

  private _getProdotti(){
    const prodotti$ = this.service.getProdotti();
    prodotti$.subscribe((p) => {
      this.prodotti =p.series[0].data;
      this.prodottiColumns = Object.keys(this.prodotti[0]).map((key) => ({
        header: key,
        field:key,
      }));
    });
  }

  



}
