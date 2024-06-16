import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { RosterService } from '../../services/roster.service';
import { Subscription } from 'rxjs';
import { UserRoster } from '../../interface/userRoster';
import { ShiftFilterPipe } from '../../pipes/shift-filter.pipe';
import { UserShift } from '../../interface/user-shift';
import { ExcelConverterComponent } from '../excel-converter/excel-converter.component'; 
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-all-view-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ShiftFilterPipe, ExcelConverterComponent, TooltipDirective],
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
  isSideOpen: boolean = false;
  sortedRosterData: any[] = [];
  options:Array<string> = [
    "T7", "S1", "F3", "G2", "G1", "CO", "PH", "L", "WO"
  ]  
  
filterOption:any;
userOverviewArray: Array<UserShift> = [] 
prevObject!: string; 

  constructor(
    private rosterService: RosterService
  ){  
    this.getRosterData(this.month) 
  } 
  
  //function for filter table  
  objectifyFilter(date:any, option:string){ 
  
  if(this.prevObject && this.prevObject !== date.date){
    this.dateObject.filter(el => {
      if(el?.date == this.prevObject){
        el.option = ''
      }else{
        return el
      }
    });
  } 
  this.prevObject = date.date 

  if(!this.filterOption){
    this.filterOption = {}   
  } 
    
  if(date.date && option){
      this.filterOption = {
        date: date.date,
        shift: option
      }
  }else if(option == ''){   
      this.filterOption = undefined 
  } 
    return this.filterOption, this.dateObject
  }
 
  getRosterData(month:string){ 
    this.month = month
    this.dateObject = []
    this.rosterData = []
    this.dateObject = []
    if(month){
     this.rostersSubscription = this.rosterService.getRosterforDashboard(month).subscribe((res) =>{ 
        this.rosterData = res   
        this.rosterData[0].roster.forEach((el:any) => {
          if(el?.dayNumber){
           this.dateObject.push({
             date : el.dayNumber,
             day : el.weekday, 
           })
          }
        }) 
       }
      )
    }
  }
  toggleDownbar() {
    console.log(this.isOpen);
    
    this.isOpen = !this.isOpen;
    this.getDetailedRosterValue()
  }
  toggleSidebar() {
    console.log(this.isSideOpen);
    
    this.isSideOpen = !this.isSideOpen;
    this.createOverViewwithUser()
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
  

  createOverViewwithUser(){ 
    console.log(this.rosterData);
    const userOverviewArray:Array<UserShift> = [];
    this.rosterData.forEach((item: any) => {
        let overiewObject: UserShift = {
            username: item.username,
            S1: 0,
            T7: 0,
            G2: 0,
            G1: 0,
            L: 0,
            PH: 0,
            F3: 0,
            CO: 0,
            WO: 0,
            NA: 0,
        };
        item.roster.forEach((el: any) => {
            switch (el?.option) {
                case 'S1':
                    overiewObject.S1++;
                    break;
                case 'T1':
                    overiewObject.T7++;
                    break;
                case 'G2':
                    overiewObject.G2++;
                    break;
                case 'G1':
                    overiewObject.G1++;
                    break;
                case 'L':
                    overiewObject.L++;
                    break;
                case 'PH':
                    overiewObject.PH++;
                    break;
                case 'F3':
                    overiewObject.F3++;
                    break;
                case 'CO':
                    overiewObject.CO++;
                    break;
                case 'WO':
                    overiewObject.WO++;
                    break;
                default:
                    overiewObject.NA++;
            }
        });
        userOverviewArray.push(overiewObject);
    });
    console.log(userOverviewArray);
    return this.userOverviewArray = userOverviewArray;

  }
   



  routeBack(){
    this.routetoPreviousState.emit(true)

  }

  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
}
