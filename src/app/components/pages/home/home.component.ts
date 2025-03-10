
import { Component, AfterViewInit  } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }

  // banner
  heroSliderConfig =  {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "fade": true,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "arrows": false,
    "dots": false,
  };
  bannerPosts = [
    { img: 'assets/img/banner/headshot2.jpg' },
    { img: 'assets/img/banner/headshot1.jpg' },
  ];
  // Categories
  categoryPosts = [
    { icon: 'fas fa-file-contract', title: 'Smart Contracts', numberOfYears: '6' },
    { icon: 'fas fa-laptop-code', title: 'Web Applications', numberOfYears: '5' },
    { icon: 'fas fa-mobile-alt', title: 'Mobile Applications', numberOfYears: '4' },
    { icon: 'fas fa-server', title: 'Back-end Development', numberOfYears: '5' },
  ];
  // Cta
  ctabg = 'assets/img/others/product.png';
  // wideslider
  wideSliderConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 2500,
    "arrows": false,
    "dots": false,
    "responsive": [{
      "breakpoint": 992,
      "settings": {
        "slidesToShow": 3,
      },
    },
    {
      "breakpoint": 767,
      "settings": {
        "slidesToShow": 1,
      },
    },
    ],
  };
  skills = [
    { img: 'assets/img/skills/solidity.png', title: 'Solidity', yearsOfExp: '6' },
    { img: 'assets/img/skills/Hardhat.png', title: 'Hardhat', yearsOfExp: '5' },
    { img: 'assets/img/skills/STARKs-vs-SNARKs.jpg', title: 'Zero Knowledge', yearsOfExp: '2' },
    { img: 'assets/img/skills/nodejs.png', title: 'Node.js', yearsOfExp: '5' },
    { img: 'assets/img/skills/typescript.png', title: 'TypeScript', yearsOfExp: '5' },
    { img: 'assets/img/skills/ExpressJS.png', title: 'Express.js', yearsOfExp: '5' },
    { img: 'assets/img/skills/RESTapi.png', title: 'REST APIs', yearsOfExp: '5' },
    { img: 'assets/img/skills/angular.webp', title: 'Angular', yearsOfExp: '5' },
    { img: 'assets/img/skills/ionic.webp', title: 'Ionic', yearsOfExp: '5' },
    { img: 'assets/img/skills/mongodb.png', title: 'MongoDB', yearsOfExp: '3' },
    { img: 'assets/img/skills/docker.png', title: 'Docker', yearsOfExp: '2' },
    { img: 'assets/img/skills/kubernetes.jpg', title: 'Kubernetes', yearsOfExp: '2' },
  ];

  texture = 'assets/img/skills/solidity.png';
  latestProjects = [
    {
      img: 'assets/img/latest-projects/finance.webp',
      icon: 'fas fa-chart-line',
      title: 'Finance',
      text: 'Full-stack blockchain dApp demo of Market Makers (Constant Product, Constant Sum & Order Book) that simulate secure, transparent financial systems and mirror real-world digital asset management.'
    },
    {
      img: 'assets/img/latest-projects/realEstate.webp',
      icon: 'fas fa-building',
      title: 'Real Estate',
      text: 'Full-stack blockchain dApp demo featuring NFT-based escrow contracts that replicate the real-world process of purchasing property, ensuring trust and transparency in real estate transactions.'
    },
    {
      img: 'assets/img/latest-projects/supplyChain.jpg',
      icon: 'fas fa-truck',
      title: 'Supply Chain',
      text: 'Full-stack blockchain dApp demo integrating product provenance, inventory management, and automated process contracts to drive efficiency, security and traceability across global supply networks.'
    },
  ];

  // Video poster
  videoimg = 'assets/img/text-block/03.jpg';

  // Blog post
  latestPostSliderConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "arrows": true,
    "dots": false,
    "prevArrow": '.latest-post-arrow .prev-arrow',
    "nextArrow": '.latest-post-arrow .next-arrow',
    "responsive": [{
      "breakpoint": 992,
      "settings": {
        "slidesToShow": 2,
      },
    },
    {
      "breakpoint": 576,
      "settings": {
        "slidesToShow": 1,
      },
    },
    ],
  };
  blogPosts = [
    { img: 'assets/img/blog/blog-1.png', title: 'Ruby on Rose Accessories and Blue Gemstones.', postdate: '26 Jun, 2020', linktext: 'Read More' },
    { img: 'assets/img/blog/blog-2.png', title: 'Matching Jewellery Sets with your Outwear.', postdate: '26 Jun, 2020', linktext: 'Read More' },
    { img: 'assets/img/blog/blog-3.png', title: 'New Retro Collection of Pendants and Ring sets.', postdate: '26 Jun, 2020', linktext: 'Read More' },
    { img: 'assets/img/blog/blog-4.png', title: 'Special Wedding Rings Sets for Him and for Her.', postdate: '26 Jun, 2020', linktext: 'Read More' },
  ];
  ngAfterViewInit() {
    // Counter
    ($('.counter')as any).each(function () {
      ($(this)as any).prop('Counter', 0).animate({
        Counter: $(this).text()
      }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          ($(this)as any).text(Math.ceil(this.Counter));
        },
      });
    });
    // Video popup
    ($('.popup-video') as any).magnificPopup({
        type: 'iframe',
    });

  }


}
