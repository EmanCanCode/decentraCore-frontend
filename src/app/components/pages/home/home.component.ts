import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import $ from 'jquery';
import 'magnific-popup';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = 0;
  private sliderTimer?: number;

  // banner
  heroSliderConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    dots: false,
  };
  bannerPosts = [
    { img: 'assets/img/banner/emanUSMC.png' },
    { img: 'assets/img/banner/headshot2.jpg' },
  ];

  // Categories
  categoryPosts = [
    { icon: 'fas fa-file-contract', title: 'Smart Contracts', numberOfYears: '6' },
    { icon: 'fas fa-laptop-code', title: 'Web Apps', numberOfYears: '5' },
    { icon: 'fas fa-mobile-alt', title: 'Mobile Apps', numberOfYears: '4' },
    { icon: 'fas fa-server', title: 'Back-end Dev', numberOfYears: '5' },
  ];

  // Cta
  ctabg = 'assets/img/others/product.png';

  // wideslider
  wideSliderConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    fade: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 767,
        settings: { slidesToShow: 2 },
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
      text: 'Full-stack blockchain dApp demo of Market Makers (Constant Product, Constant Sum & Order Book) that simulate secure, transparent financial systems and mirror real-world digital asset management.',
      href: 'finance/cpamm'
    },
    {
      img: 'assets/img/latest-projects/realEstate.webp',
      icon: 'fas fa-building',
      title: 'Real Estate',
      text: 'Full-stack blockchain dApp demo featuring NFT-based escrow contracts that replicate the real-world process of purchasing property, ensuring trust and transparency in real estate transactions.',
      href: 'realEstate/shop'
    },
    {
      img: 'assets/img/latest-projects/supplyChain.jpg',
      icon: 'fas fa-truck',
      title: 'Supply Chain',
      text: 'Full-stack blockchain dApp demo integrating product provenance, inventory management, and automated process contracts to drive efficiency, security and traceability across global supply networks.',
      href: 'supplyChain/shop'
    },
  ];

  // Video poster
  videoimg = 'assets/img/text-block/03.jpg';

  // Blog post
  latestPostSliderConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    fade: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    dots: false,
    prevArrow: '.latest-post-arrow .prev-arrow',
    nextArrow: '.latest-post-arrow .next-arrow',
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 },
      },
    ],
  };
  blogPosts = [
    { img: 'assets/img/blog/1.png', title: 'What is DecentraCore?', postdate: '12 May, 2025', linktext: 'For Recruiters' },
    { img: 'assets/img/blog/2.png', title: 'How to Code Dex AMMs.', postdate: '12 May, 2025', linktext: 'For Devs' },
    { img: 'assets/img/blog/3.png', title: 'How to Put Real Estate On Chain', postdate: '12 May, 2025', linktext: 'For Investors' },
    { img: 'assets/img/blog/4.png', title: 'How to Code Provenance Tracking', postdate: '12 May, 2025', linktext: 'For Logistics' },
  ];

  constructor(
    private wowService: NgwWowService,
    private alertService: AlertService
  ) {
    this.wowService.init();
  }

  ngOnInit() {
    this.showWelcome();
    this.sliderTimer = window.setInterval(() => this.nextSlide(), 4000);
  }

  ngOnDestroy() {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
    }
  }

  ngAfterViewInit() {
    // Counter
    ($('.counter') as any).each(function () {
      ($(this) as any).prop('Counter', 0).animate({
        Counter: $(this).text()
      }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          ($(this) as any).text(Math.ceil(this.Counter));
        },
      });
    });
    // Video popup
    ($('.popup-video') as any).magnificPopup({
      type: 'iframe',
    });
  }

  private showWelcome() {
    const html = `
      <p><strong>DecentraCore</strong> ties together <strong>Finance</strong>, <strong>Supply Chain</strong> & <strong>Real Estate</strong> dApps into one working full-stack blockchain platform all running on my <strong>private Hardhat network</strong>.</p><br>
      <p>If you’re on <strong>mobile</strong>, please use <strong>MetaMask</strong> or another Web3 wallet to interact with the chain.</p>
    `.trim();

    this.alertService.welcome(
      'info',
      'Welcome to DecentraCore!',
      '',
      {
        html,
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: {
          confirmButton: 'main-btn swal2-confirm',
        }
      }
    );
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.bannerPosts.length;
  }
}
