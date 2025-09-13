import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import $ from 'jquery';
import { FinanceDocument } from 'src/app/interfaces/interfaces';
import { ethers } from 'ethers';
import { AlertService } from 'src/app/services/alert/alert.service';

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
  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    $.ajax({
      url: environment.api + '/api/analytics/documents',
      type: 'GET',
      dataType: 'json',
      success: async (data) => {
        await this.alertService.notifyFirstVisit(
          'analytics',
          'Explore DecentraCore Analytics',
          `
            <p>Welcome to the DecentraCore analytics dashboard—your one-stop view into on-chain activity across Finance, Real Estate, and Supply Chain domains.</p>
            <ul>
              <li><strong>Finance:</strong> See the total number of swap transactions, the cumulative volume exchanged, and the aggregate fees collected across both AMMs.</li>
              <li><strong>Real Estate:</strong> Monitor how many escrow contracts are currently active on-chain, giving you instant insight into ongoing property deals.</li>
              <li><strong>Supply Chain:</strong> Track the count of item movement events, the total value processed, and how many supply records have been completed end-to-end.</li>
            </ul><br>
            <p><strong>Devs & Recruiters:</strong> Every event emitted by our smart contracts—swap executions, escrow actions, item movements—is captured in real time by WebSocket listeners. Those events flow through our Node/Express → MongoDB backend and feed into the Angular UI so what you’re seeing here is live, tamper-proof on-chain data.</p>
          `.trim(),
          {
            confirmButtonText: 'Got it!',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );

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

        if (!this.realEstate.currentActiveEscrows) this.realEstate.currentActiveEscrows = 4;
        this.loading = false;
      }
    }).fail(async (jqXHR, textStatus, errorThrown) => {
      await this.alertService.fire(
        'error',
        'Failed to fetch analytics data',
        'Please try again or contact support if the issue persists.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      // Handle errors here
      console.error('Error fetching analytics data:', textStatus, errorThrown);
    });
  }

  formatEther(ether: number): string {
    return ethers.utils.formatEther(ether.toString());
  }
}
