import { Component, HostListener, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
}) 
export class FooterComponent implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/light-v10';
  lng = -77.04;
  lat = 38.860;
  antialias: true;
  pitch: 45;
  // logo
  logo = 'assets/img/logo.png';
  constructor() { }

  ngOnInit(): void {
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
  

  ScrolltoTop() {
    const navbar = document.getElementById('backToTop');
    if (document.body.scrollTop >= 300 || document.documentElement.scrollTop > 300) {
      navbar.classList.add('active');
    } else {
      navbar.classList.remove('active');
    }
  }
  isShow: boolean;
  topPosToStartShowing = 300;

  @HostListener('window:scroll')
  checkScroll() {

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
