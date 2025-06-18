import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import $ from 'jquery';
import { FinanceDocument } from 'src/app/interfaces/interfaces';
import { ethers } from 'ethers';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  finance: Pick<
    FinanceDocument,
    'totalSwaps' |
    'totalVolume' |
    'totalFees'
  >;
  realEstate: {
    currentActiveEscrows: number;
  };
  supplyChain: {
    totalValueProcessed: number;
    totalItemMovements: number;
    completedRecords: number;
  };
  loading = true;
  constructor() { }

  ngOnInit(): void {
    $.ajax({
      url: environment.api + '/api/analytics/documents',
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        let _finance: Pick<
          FinanceDocument,
          'totalSwaps' |
          'totalVolume' |
          'totalFees'
        > = {
          totalSwaps: 0,
          totalVolume: 0,
          totalFees: 0
        };
        data.finance.forEach((doc: FinanceDocument) => {
          _finance.totalSwaps += doc.totalSwaps;
          _finance.totalVolume += doc.totalVolume;
          _finance.totalFees += doc.totalFees;
        });
        this.finance = _finance;

        this.realEstate = {
          currentActiveEscrows: data.realEstate.length
        };

        const _supplyChain = data.supplyChain;
        const invMgt = _supplyChain[0];
        const prov = _supplyChain[1];
        this.supplyChain = {
          totalItemMovements: invMgt.totalMovements,
          totalValueProcessed: prov.totalValueProcessed,
          completedRecords: prov.completedRecords
        };

        console.log('Analytics data:', {
          finance: this.finance,
          realEstate: this.realEstate,
          supplyChain: this.supplyChain
        });

        this.loading = false;
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
      // Handle errors here
      console.error('Error fetching analytics data:', textStatus, errorThrown);
      // You can show an error message to the user or take other actions
      // alert('Failed to fetch analytics data. Please try again later.');
    });
  }

  formatEther(ether: number): string {
    return ethers.utils.formatEther(ether.toString());
  }
}
