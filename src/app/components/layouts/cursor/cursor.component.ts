import { Component, OnInit } from '@angular/core';
import $ from 'jquery'

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.css']
})
export class CursorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    function cursor (){
      $(document).on('mousemove', function(e) {

        var xPos = e.pageX;
        var yPos = e.pageY;
        $('.circle-out').css({
          'top': yPos,
          'left': xPos
        });

      });
    }
    cursor()
  }

}
