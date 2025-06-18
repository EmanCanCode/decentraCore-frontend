import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  // Image
  breadcrumbimg = 'assets/img/bg/defaultBreadCrumb.png'; // Default image

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Subscribe to router events to capture URL changes dynamically:
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setBreadcrumbImage();
      });

    // Initialize background image when component loads
    this.setBreadcrumbImage();
  }

  private setBreadcrumbImage() {
    const url = this.router.url; // e.g., '/finance/cpamm' or '/realEstate/shop'
    if (url.includes('finance')) {
      this.breadcrumbimg = 'assets/img/latest-projects/finance.webp';
    } else if (url.includes('realEstate')) {
      this.breadcrumbimg = 'assets/img/latest-projects/realEstate.webp';
    } else if (url.includes('supplyChain')) {
      this.breadcrumbimg = 'assets/img/latest-projects/supplyChain.jpg';
    } else {
      this.breadcrumbimg = 'assets/img/bg/defaultBreadCrumb.png'; // Fallback/default image
    }
  }

}
