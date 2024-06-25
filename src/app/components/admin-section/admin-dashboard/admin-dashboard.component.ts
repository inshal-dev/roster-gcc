import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RosterService } from '../../../services/roster.service';
import { Subscription, count, filter, retry } from 'rxjs';
import { FormsModule } from '@angular/forms'; 
import { UserRoster } from '../../../interface/userRoster';
import io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';   
import { Toast } from 'bootstrap';   
import { UserShift } from '../../../interface/user-shift';
import { CategoryPipe } from '../../../pipes/category.pipe';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';  

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
    imports: [CommonModule, NgFor, FormsModule, CategoryPipe]
})


export class AdminDashboardComponent {

  @Input() state:any ; 
  @Input() monthState:any; 
  @Input() userCount!:any
  @ViewChild('myToast') myToast!: ElementRef; 
  
  @ViewChildren(AdminNavComponent) nav: any;

  @ViewChild('toastWarning')
  warningToast!:ElementRef;

  rostersSubscription!: Subscription
  rosterData:any
  sel:any
  selectedUser!:UserRoster | null;
  date:Array<any> = [];
  startDate:number = 0;
  endDate:number = 0;
  rosterValue!:string;
  // initial:number = 0;
  // final: number = 15; 
  // initialRoster : number = 0;
  // finalRoster : number = 15
  rosterObjectId!:string;
  message$: BehaviorSubject<string> = new BehaviorSubject(''); 
  socket = io('https://roster-server.onrender.com/');
  //socket = io('http://localhost:3000/')
  nullCount = 0
  apiResponse!:string;
  options:Array<string> = [
    "T7", "S1", "F3", "G2", "G1", "CO", "PH", "L", "WO"
  ]
 
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthCount: number = 0;
  responseLength: any;
  currentDate: moment.Moment = moment().add(1, 'months');
  month: string = this.currentDate.format('MMMM')
  btnMessage:string= 'Publish';
  isOpen: boolean = false; 
  isSideOpen: boolean = false;
  sortedRosterData: any[] = [];
  filterRoster:any[] = [] 
  userOverviewArray: Array<UserShift> = [];
  userCategory!:string;
  temp4Category!:string;
  customOrder = ['OL', 'TL', 'SM', 'Backup', 'BDC'];
  loaderState:boolean = true;
  userCheck!: string | null;
  constructor(
    private rosterService: RosterService, 
  ){ 
  }

  ngOnInit(){  
    this.monthState = this.month 
    this.getRosterData()      
    this.date = [] 

  }
   
  ngOnChanges(){  
    console.log(this.userCount?.state);
     
    //commented pagination logic
    // this.nullCount = 0
    // this.monthCount = 0
    // this.initial = this.initialRoster = 0
    // this.final = this.finalRoster = 15
    
   // this.rosterData = []   
  //  console.log(this.rosterData[0]?.roster.slice(this.initialRoster, this.finalRoster + this.nullCount)) 
    setTimeout(()=>{
      if(this.monthState){
        console.log(this.monthState)  
       // this.rosterData = []
        this.getRosterData()
      } 
      if(this.state == 'True' && this.monthState == this.month){
        console.log(this.state, this.month);
        console.log(this.rosterData);
        
       this.submitRoster()
      }
    }, 100)  
    setTimeout(()=>{
      this.loaderState = false
    }, 3000)
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
 
   
  getRosterData(){  
      if(this.monthState == undefined){
        this.monthState = this.month
      }else{
        this.rostersSubscription = this.rosterService.getRosters(this.monthState).subscribe(
          (res) => {
            this.rosterData = res   
            this.apiResponse = this.rosterData.res 
            this.responseLength = this.rosterData.data.length
           // console.log(this.responseLength); 
           
            this.rosterObjectId = this.rosterData.data[0]._id 
            //console.log(this.rosterObjectId); 
            if(this.rosterData.res == 'pre-published'){ 
              this.rosterData = this.rosterData.data[0].roster
            }else{
              this.rosterData = this.rosterData.data
              this.rosterData.sort((a:any, b:any) => {
                const indexA = this.customOrder.indexOf(a.category);
                const indexB = this.customOrder.indexOf(b.category);
            
                // If a category is not found, indexOf returns -1. Handle such cases by placing them at the end.
                const effectiveIndexA = indexA === -1 ? this.customOrder.length : indexA;
                const effectiveIndexB = indexB === -1 ? this.customOrder.length : indexB;
            
                return effectiveIndexA - effectiveIndexB;
            });
             
      } 

            this.createOverViewwithUser()
            //check this logic again 
            this.date = []
              this.rosterData[0].roster.forEach((el:any) => {
               if(el?.dayNumber){
                this.date.push({
                  date : el.dayNumber,
                  day : el.weekday
                })
               }else{
               // console.log('no data'); 
               } 
              //  if(el == null){
              //   this.nullCount += 1 
              //  }else{
              //   this.monthCount += 1
              //  } 
              
              return this.date 
              })   
             
           
          }
        )
      }

  }

  createOverViewwithUser(){ 
    //console.log(this.rosterData);
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
                case 'T7':
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
    // /console.log(userOverviewArray);
    return this.userOverviewArray = userOverviewArray;

  }

  getDetailedRosterValue() { 
    const dateOptionsMap:any = {};
    this.sortedRosterData = []
  console.log(this.rosterData.length);
  
    this.rosterData.forEach((rosterItem: any) => {
      rosterItem.roster.forEach((dayData: any) => {
        
          if (dayData && dayData.dayNumber) {
              const date = 'date' + dayData.dayNumber;
              const option = dayData.option; 
              
              // Initialize options count object for the date if not already initialized
              if (!dateOptionsMap[date]) { 
                  dateOptionsMap[date] = {};
              }
  
              // Increment count for the option
    //          console.log((dateOptionsMap[date][option] || 0) + 1)
              dateOptionsMap[date][option] = (dateOptionsMap[date][option] || 0) + 1;
          } else {
              return dateOptionsMap
            //  console.log('dayData is undefined or missing properties:', dayData);
          }
      });
  }); 
   
  const dataArray = Object.entries<any>(dateOptionsMap).map(([date, options]) => {
      const optionsArray = Object.entries<any>(options).map(([option, count]) => ({ option, count }));
      
      return { date, options: optionsArray };
  }); 
  this.sortedRosterData = dataArray; 
  }

  prepareDataForTable() {
    const tableData:any = [];
    for (const option of this.options) { 
      const rowData:any = { shift: option, counts: [] };
      for (const data of this.sortedRosterData) {
        const count = data.options.find((item:any) => item.option === option)?.count || 0;
        rowData.counts.push(count);
      }
      tableData.push(rowData);
    }  
    const order = ["F3", "S1", "T7", "G1", "G2", "L", "PH", "CO", "WO"];
    tableData.sort((a:any, b:any) => order.indexOf(a.shift) - order.indexOf(b.shift));
    return tableData;
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
      if (rowData && rowData.counts && !['WO', 'L', 'PH', 'CO'].includes(rowData.shift)) { // Exclude specific shifts
        rowData.counts.forEach((count: any, index: any) => {
          totalCounts[index] += count || 0; // If count is null or undefined, use 0
        });
      }
    }); 
  
    return totalCounts;
  }
 
  submitRoster(){ 
    let data = {
      _id: this.rosterObjectId,
      roster: this.rosterData
    }

    console.log(this.rosterData);
    
    
    if(this.apiResponse != '404' ){
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
      //console.log("Nope can't do that")
    }
    
  }

  ///commented pagination logic
 
  // nextHalf(){
  //   this.initial = this.final; 
  //   this.initialRoster = this.finalRoster + this.nullCount 
  //   this.final = this.monthCount
  //   // console.log('222', this.final)
  //   this.finalRoster = this.monthCount
  //  // console.log(this.finalRoster)
  // }
  // prevHalf(){
  //   this.initial = 0;
  //   this.initialRoster = 0
  //   this.final = 15
  //   this.finalRoster = this.final 
  //  // console.log(this.finalRoster)
  // }
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
    this.userCheck = localStorage.getItem('userName'); 
   // console.log(this.currentDate.date() >= 15, this.monthState !== this.month);
    if(this.monthState === this.month && this.userCount.state){
      if(this.currentDate.date() >= 15){
        let modifiedRoster = {
          _id: this.rosterObjectId,
          roster: this.rosterData
        }    
        this.socket.emit('userRosterUpdate', modifiedRoster);    
        // console.log(modifiedRoster)
        this.getNewMessage()
      }else{
          const toastElement = this.warningToast.nativeElement;
          const bootstrapToast = new Toast(toastElement);
          bootstrapToast.show();
      }
    }else if(this.userCheck === 'admin-pro'){
      console.log(this.month, this.monthState, this.userCheck);
      let modifiedRoster = {
        _id: this.rosterObjectId,
        roster: this.rosterData
      }    
      this.socket.emit('userRosterUpdate', modifiedRoster);    
      // console.log(modifiedRoster)
      this.getNewMessage()
    }else{
          const toastElement = this.warningToast.nativeElement;
          const bootstrapToast = new Toast(toastElement);
          bootstrapToast.show();
    }
    
     
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

 