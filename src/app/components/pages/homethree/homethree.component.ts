import { Component, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { NgwWowService } from 'ngx-wow';
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-homethree',
  templateUrl: './homethree.component.html',
  styleUrls: ['./homethree.component.css']
})
export class HomethreeComponent implements AfterViewInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/light-v10';
  lng = -77.04;
  lat = 38.860;
  antialias: true;
  pitch: 45;

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }
  // Banner
  bannersliderConfig = {
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 5000,
    "dots": false,
    "fade": true,
    "arrows": false,
  };
  bannerposts = [
    { img: 'assets/img/banner/banner1.jpg', tag: 'Jewelry Design With Love', title: "The Perfect Jewels For You ", btn1: 'explore more', btn2: 'Buy Now' },
    { img: 'assets/img/banner/banner2.webp', tag: 'Jewelry Design With Love', title: 'The Perfect Jewels For You ', btn1: 'explore more', btn2: 'Buy Now' },
  ];
  // Categories
  categoryposts = [
    { icon: 'flaticon-bracelet', title: 'Golden Pendants', numberofproduct: '12' },
    { icon: 'flaticon-ring', title: 'Diamond Rings', numberofproduct: '27' },
    { icon: 'flaticon-necklace', title: 'Gold Necklaces', numberofproduct: '18' },
    { icon: 'flaticon-earrings', title: 'Designer Earings', numberofproduct: '23' },
  ];
  // Room slider 2
  roomslidertwoConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": false,
    "autoplaySpeed": 4000,
    "arrows": true,
    "dots": false,
    "centerMode": true,
    "centerPadding": '28%',
    "prevArrow": '<div class="slick-arrow prev-arrow"><i class="fal fa-arrow-left"></i></div>',
    "nextArrow": '<div class="slick-arrow next-arrow"><i class="fal fa-arrow-right"></i></div>',
    "responsive": [{
      "breakpoint": 1600,
      "settings": {
        "centerPadding": '20%',
      },
    },
    {
      "breakpoint": 992,
      "settings": {
        "centerPadding": '15%',
      },
    },
    {
      "breakpoint": 768,
      "settings": {
        "centerPadding": '10%',
      },
    },
    {
      "breakpoint": 576,
      "settings": {
        "centerPadding": '5%',
      },
    },
    ],
  };
  roomslidertwoposts = [
    { img: 'assets/img/room-slider/06.jpg', title: 'Get All Gold Jewels', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.', price: '345', weight: '10gm' },
    { img: 'assets/img/room-slider/08.jpg', title: 'Grab Silver Jewel', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.', price: '235', weight: '10gm' },
    { img: 'assets/img/room-slider/07.jpg', title: 'Buy All Diamond', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.', price: '1,345', weight: '10gm' },
  ];
  // Counter
  counterposts = [
    { icon: 'flaticon-bracelet-1', number: '84', prefix: 'k', title: 'Jewelriess in Album' },
    { icon: 'flaticon-like', number: '10', prefix: 'M', title: 'Happy Feedbacks' },
    { icon: 'flaticon-earrings', number: '02', prefix: 'k', title: 'Categories Served' },
    { icon: 'flaticon-user-1', number: '100', prefix: 'M', title: 'Happy Clients' },
  ];
  // Video img
  videobg = 'assets/img/text-block/03.jpg';
  // Gallery slider
  gallerysliderConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "arrows": false,
    "dots": false,
    "responsive": [{
      "breakpoint": 768,
      "settings": {
        "slidesToShow": 2,
      },
    },
    {
      "breakpoint": 500,
      "settings": {
        "slidesToShow": 1,
      },
    },
    ],
  };
  galleryposts = [
    { img: 'assets/img/menu/menu-gallery-1.jpg' },
    { img: 'assets/img/menu/menu-gallery-2.jpg' },
    { img: 'assets/img/menu/menu-gallery-3.jpg' },
    { img: 'assets/img/menu/menu-gallery-1.jpg' },
    { img: 'assets/img/menu/menu-gallery-2.jpg' },
    { img: 'assets/img/menu/menu-gallery-3.jpg' },
  ];
  shapeicon = 'assets/img/icon/06.png';
  // Cta features
  ctafeatures = [
    {icon:'flaticon-necklace',title:'Online Jewelry To Your Door',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',number:'01',animationtime:'.3s'},
    {icon:'flaticon-like',title:'Great User Feedback',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',number:'02',animationtime:'.4s'},
    {icon:'flaticon-headphones',title:'Available For Support',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',number:'03',animationtime:'.5s'},
  ];
  // post
  postimg = 'assets/img/latest-post/03.jpg';

  ngAfterViewInit(): void {
    // Video popup
    ($('.popup-video') as any).magnificPopup({
      type: 'iframe',
    });
    // Counter
    $('.counter').each(function () {
      $(this).prop('Counter', 0).animate({
        Counter: $(this).text()
      }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          // $(this).text(Math.ceil(this.Counter));
        },
      });
    });
    // Map
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYWJlZHNoIiwiYSI6ImNrNnRyZ3d4aDAyMzkzZXBoc3RsYnM0aGwifQ.yhr3W_OOI6xXElmSY8cyPg';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 11.5,
      center: [this.lng, this.lat]
    });
    // Add map controls

    var marker = new mapboxgl.Marker()
      .setLngLat([-77.04, 38.907])
      .addTo(this.map);
    this.map.on('load', function () {
      // Insert the layer beneath any symbol layer.
      var layers = this.map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      this.map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',

          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
        labelLayerId
      );
    });
  }

}
