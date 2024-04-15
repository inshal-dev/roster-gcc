import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster.service';
import { Subscription } from 'rxjs';
import { UserRoster } from '../../interface/userRoster';

@Component({
  selector: 'app-all-view-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-view-dashboard.component.html',
  styleUrl: './all-view-dashboard.component.scss'
})
export class AllViewDashboardComponent {
  @Output() routetoPreviousState = new EventEmitter<any>;
  @Input() monthValue:string | undefined;
  currentDate: moment.Moment = moment()
  month:any = this.currentDate.format('MMMM'); 
  monthList:Array<string> = [
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  dateObject:Array<any> = [];
  rosterData:Array<UserRoster> = [];
  rostersSubscription!: Subscription;
  isOpen: boolean = false; 
  sortedRosterData: any[] = [];
  options:Array<string> = [
    "T1", "S1", "F3", "G2", "G1", "CO", "PH", "L", "WO"
  ]
  constructor(
    private rosterService: RosterService
  ){  
    this.getRosterData(this.month) 
  }
 

  getRosterData(month:string){ 
    this.month = month
    this.dateObject = []
    this.rosterData = []
    this.dateObject = []
    if(month){
     this.rostersSubscription = this.rosterService.getRosterforDashboard(month).subscribe((res) =>{
        // console.log(res)
        this.rosterData = res 
     //   console.log(this.rosterData.length)
        this.rosterData[0].roster.forEach((el:any) => {
          if(el?.dayNumber){
           this.dateObject.push({
             date : el.dayNumber,
             day : el.weekday
           })
          }
        }) 

      },(err) =>{
       console.log(err)
      }
      )
    }
  }
  toggleSidebar() {
    console.log(this.isOpen);
    
    this.isOpen = !this.isOpen;
    this.getDetailedRosterValue()
  }
  getDetailedRosterValue() { 
    const dateOptionsMap:any = {};
    if(this.rosterData.length > 0){
      this.rosterData.forEach((rosterItem: any) => {
        rosterItem.roster.forEach((dayData: any) => {
            if (dayData && dayData.dayNumber && dayData.option) {
                const date = 'date' + dayData.dayNumber;
                const option = dayData.option;
    
                // Initialize options count object for the date if not already initialized
                if (!dateOptionsMap[date]) {
                    dateOptionsMap[date] = {};
                }
    
                // Increment count for the option
                dateOptionsMap[date][option] = (dateOptionsMap[date][option] || 0) + 1;
            } else {
                console.log('dayData is undefined or missing properties:', dayData);
            }
        });
    }); 
    
    // Convert dateOptionsMap to an array of objects
    const dataArray = Object.entries<any>(dateOptionsMap).map(([date, options]) => {
        const optionsArray = Object.entries<any>(options).map(([option, count]) => ({ option, count }));
        return { date, options: optionsArray };
    });
    this.sortedRosterData = dataArray;
    }else{
      console.log('No data for current month')
    }
  
   
  
  }

  prepareDataForTable() {
    let tableData:any = [];
    if(this.rosterData.length > 0){
      for (const option of this.options) {
        const rowData:any = { shift: option, counts: [] };
        for (const data of this.sortedRosterData) {
          const count = data.options.find((item:any) => item.option === option)?.count || 0;
          rowData.counts.push(count);
        }
        tableData.push(rowData);
      } 
      return tableData;
    }else{
      return tableData = []
    }
  }
  
  getTotalCounts(): number[] {
    const totalCounts: number[] = [];
    const preparedData = this.prepareDataForTable();
    
    if (preparedData.length === 0) {
      return totalCounts;
    }
  
    // Initialize total counts array with zeros
    const totalLength = preparedData[0].counts.length;
    for (let i = 0; i < totalLength; i++) { 
      totalCounts.push(0);
    }
  
    // Sum counts for each day, excluding specific shifts
    preparedData.forEach((rowData: any) => {
      if (!['WO', 'L', 'PH', 'CO'].includes(rowData.shift)) { // Exclude specific shifts
        rowData.counts.forEach((count: any, index: any) => {
          totalCounts[index] += count;
        });
      }
    }); 
  
    return totalCounts;
  }
  
  

  routeBack(){
    this.routetoPreviousState.emit(true)

  }

  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
}
