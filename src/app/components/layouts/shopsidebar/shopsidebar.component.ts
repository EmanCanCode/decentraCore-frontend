import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shopsidebar',
  templateUrl: './shopsidebar.component.html',
  styleUrls: ['./shopsidebar.component.css']
})
export class ShopsidebarComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<string[]>();
  selectedFilters: string[] = [];

  constructor() { }
  // Color selection
  propertyTypes = [
    { name: 'Single Family' },
    { name: 'Multi-Family' },
    { name: 'Luxury' },
  ];
  // Instagram Feeds
  instafeeds = [
    { img: 'assets/img/instagram-wid/01.jpg' },
    { img: 'assets/img/instagram-wid/02.jpg' },
    { img: 'assets/img/instagram-wid/03.jpg' },
    { img: 'assets/img/instagram-wid/04.jpg' },
    { img: 'assets/img/instagram-wid/05.jpg' },
    { img: 'assets/img/instagram-wid/06.jpg' },
    { img: 'assets/img/instagram-wid/07.jpg' },
    { img: 'assets/img/instagram-wid/08.jpg' },
    { img: 'assets/img/instagram-wid/09.jpg' },
  ];
  ngOnInit(): void {
    // Initially select all property types.
    this.selectedFilters = this.propertyTypes.map(pt => pt.name);
    this.filterChanged.emit(this.selectedFilters);
  }

  onCheckboxChange(event: Event, propertyType: string) {
    const checkbox = event.target as HTMLInputElement;

    // Prevent unchecking the last active filter and reselect all if attempted
    if (!checkbox.checked && this.selectedFilters.length === 1) {
      // Force all checkboxes to be reselected
      this.selectedFilters = this.propertyTypes.map(pt => pt.name);
      checkbox.checked = true;
    } else {
      if (checkbox.checked) {
        if (!this.selectedFilters.includes(propertyType)) {
          this.selectedFilters.push(propertyType);
        }
      } else {
        this.selectedFilters = this.selectedFilters.filter(f => f !== propertyType);
      }
    }

    // Emit updated filter selection
    this.filterChanged.emit(this.selectedFilters);
  }


}
