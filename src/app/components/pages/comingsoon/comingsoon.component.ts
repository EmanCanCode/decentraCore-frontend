import { OnInit, Component } from '@angular/core';
import $ from 'jquery';
import 'jquery-countdown';

@Component({
  selector: 'app-comingsoon',
  templateUrl: './comingsoon.component.html',
  styleUrls: ['./comingsoon.component.css']
})
export class ComingsoonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(".sigma_countdown-timer").each(function () {
      var $this = $(this);
      ($($this) as any).countdown($this.data('countdown'), function (event) {
        $(this).html(
          event.strftime('<li><div class="calender-input-box"><div class="calender-input-inner"> <span>Days</span><h3>%D</h3></div></div></li><li><div class="calender-input-box"><div class="calender-input-inner"> <span>Hours</span><h3>%H</h3></div></div></li><li><div class="calender-input-box"><div class="calender-input-inner"> <span>Minutes</span><h3>%M</h3></div></div></li><li><div class="calender-input-box"><div class="calender-input-inner"> <span>Seconds</span><h3>%S</h3></div></div></li>')
        );
      });
    });
  }

}
