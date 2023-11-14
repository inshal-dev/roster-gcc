import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import moment from 'moment';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  momentsMonth = moment()
  months:Array<string> = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  currentMonth!:string;

  ngOnInit(){ 
    this.currentMonth = this.months[this.momentsMonth.month()]
  }

}
