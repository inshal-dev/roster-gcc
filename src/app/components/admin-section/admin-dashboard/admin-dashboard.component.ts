import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RosterService } from '../../../services/roster.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms'; 
import { UserRoster } from '../../../interface/userRoster';
import io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';   
import { Toast } from 'bootstrap'; 


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  @Input() state:any ; 
  @ViewChild('myToast')
  myToast!: ElementRef; 

  rostersSubscription!: Subscription
  rosterData:any
  sel:any
  selectedUser!:UserRoster | null;
  date:Array<any> = [];
  startDate:number = 0;
  endDate:number = 0;
  rosterValue!:string;
  initial:number = 0;
  final: number = 15; 
  initialRoster : number = 0;
  finalRoster : number = 15
  rosterObjectId!:string;
  message$: BehaviorSubject<string> = new BehaviorSubject(''); 
  socket = io('http://localhost:3000');
  nullCount = 0
  apiResponse!:string;
  options:Array<string> = [
    "T1", "S1", "F3", "G2", "G1", "CO", "PH", "L", "WO"
  ]
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthCount: number = 0;
  responseLength: any;
  currentDate: moment.Moment = moment().add(1, 'months');
  month: string = this.currentDate.format('MMMM')
  btnMessage:string= 'Publish';

  constructor(
    private rosterService: RosterService, 
  ){ 
  }

  ngOnInit(){ 
    this.getRosterData() 
    
  }
   
  ngOnChanges(){  

    if(this.state == 'True'){
      this.submitRoster()
    }else{
      this.getRosterData()
    }
    
  }

  getRosterData(){
    if(this.state == undefined){
      this.state = this.month
    }else{
      this.rostersSubscription = this.rosterService.getRosters(this.state).subscribe(
        (res) => {
          this.rosterData = res   
          this.apiResponse = this.rosterData.res 
          this.responseLength = this.rosterData.data.length
          console.log(this.responseLength);
          
          this.rosterObjectId = this.rosterData.data[0]._id 
          console.log(this.rosterObjectId);
          
          if(this.rosterData.res == 'pre-published'){ 
            this.rosterData = this.rosterData.data[0].roster
          }else{
            this.rosterData = this.rosterData.data
          } 
          //check this logic again 
            this.rosterData[0].roster.forEach((el:any) => {
             if(el?.dayNumber){
              this.date.push({
                date : el.dayNumber,
                day : el.weekday
              })
             }else{
              console.log('no data'); 
             } 
             if(el == null){
              this.nullCount += 1
             }else{
              this.monthCount += 1
             }
            })     
          return this.date 
         
        }
      )
    }
    
  }

  submitRoster(){ 
    let data = {
      _id: this.rosterObjectId,
      roster: this.rosterData
    }
 
    if(this.apiResponse != '404'){
      this.rostersSubscription = this.rosterService.publishRoster(data).subscribe((res)=>{
        console.log('Roster Published'); 
        const toastElement = this.myToast.nativeElement;
        const bootstrapToast = new Toast(toastElement);
        bootstrapToast.show();
        //button change 
        this.btnMessage = 'Update' // Complete the logic with @Input and @Output decorator
        
        //return this.toast ? this.toast.show() : console.log('Toast not working') 
      }, (err)=> console.log(err))
    }else{
      console.log("Nope can't do that")
    }
    
  }

 
  // exportToExcel() {
  // // Transform data for Excel
  // const transformedData = this.transformDataForExcel(this.rosterData);

  // // Create worksheet
  // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData); 

  // // Create HTML table
  // let tableHtml = '<table>';
  // tableHtml += '<tr>';
  // tableHtml += '<th>Employee</th>';
  // // Add date headers
  // const dateHeaders = this.getDateHeaders(transformedData[0]);
  // for (const header of dateHeaders) {
  //   tableHtml += `<th>${header}</th>`;
  // }
  // tableHtml += '</tr>';

  // // Add data rows
  // for (const row of transformedData) {
  //   tableHtml += '<tr>';
  //   tableHtml += `<td>${row.employee}</td>`;
  //   // Add date values
  //   for (const date of dateHeaders) {
  //     tableHtml += `<td>${row[date]}</td>`;
  //   }
  //   tableHtml += '</tr>';
  // }
  // tableHtml += '</table>';



  // // Create workbook
  // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

  //   // Generate Excel file
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
  //   // Save Excel file
  //   saveAs(data, 'roster_data.xlsx');
  // }

  // getDateHeaders(userData: any): string[] {
  //   return Object.keys(userData).filter(key => key !== 'Employee');
  // }
 
  // transformDataForExcel(rosterData: any[]): any[] {
  //   const transformedData = [];
  
  //   // Iterate over each user
  //   for (const userData of rosterData) {
  //     // Create a row for each user
  //     const transformedUser: any = { Employee: userData.username };
  
  //     // Add data for each day of the month
  //     userData.roster.forEach((dayData: any) => {
  //       if (dayData?.dayNumber) {
  //         transformedUser[`Day - ${dayData.dayNumber}`] = dayData.option || ''; // Assuming option is the data you want to export
  //       }
  //     });
  
  //     transformedData.push(transformedUser);
  //   }
  
  //   // Move the "Employee" entry to the beginning of the array
  //   const employeeIndex = transformedData.findIndex(entry => entry.hasOwnProperty('Employee'));
  //   if (employeeIndex !== -1) {
  //     const employeeData = transformedData.splice(employeeIndex, 1)[0]; // Remove the "Employee" entry
  //     transformedData.unshift(employeeData); // Add it to the beginning of the array
  //   }
  //   console.log(transformedData);
    
  //   return transformedData;
  // }
  nextHalf(){
    this.initial = this.final;
    this.initialRoster = this.finalRoster + this.nullCount
    this.final = this.monthCount
    this.finalRoster = this.monthCount
  }
  prevHalf(){
    this.initial = 0;
    this.initialRoster = 0
    this.final = 15
    this.finalRoster = this.final 
    
  }
  //update selected users

  updateSelected(id:string){ 
    if(this.rosterData){
      this.rosterData.find((item:any)=> {
        item.userId == id ? this.selectedUser = item : ''
      })
    } 
  }

  getDates(startDate:any, endDate:any, rosterValue:string){ 
    this.selectedUser?.roster.forEach(el => {
     // console.log(el?.dayNumber >= startDate);
      
        if(el?.dayNumber >= startDate && el?.dayNumber <= endDate){
          el.option = rosterValue 
        }
    }); 
    this.sendMessage() 
    this.endDate = this.startDate = 0
    this.rosterValue = '' 
  }



  sendMessage() {  
    let modifiedRoster = {
      _id: this.rosterObjectId,
      roster: this.rosterData
    }    
    this.socket.emit('userRosterUpdate', modifiedRoster);    
    this.getNewMessage() 
  }

   getNewMessage(){
    this.socket.on('userRosterUpdate', (message) =>{ 
      return message
    }); 
  };


  logOutAdmin(){
      localStorage.removeItem('admin')
      localStorage.removeItem('token')
      localStorage.clear()
      location.reload()
  }

  ngOnDestory(){
    this.rostersSubscription.unsubscribe()
  }
} 

