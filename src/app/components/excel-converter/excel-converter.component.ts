import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterService } from '../../services/roster.service';
import FileSaver from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-excel-converter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-converter.component.html',
  styleUrl: './excel-converter.component.scss'
})
export class ExcelConverterComponent {
     
    @Input() month!:string

    admin!:string | null;
    state:boolean = true;
    value:string = 'Download'

    rostersSubscription!: Subscription;

    constructor(
      private rosterService: RosterService
    ){ 
    }


    ngOnInit(){
      this.admin = localStorage.getItem('userName')
    }

    download(): void { 
      
      const data = {
        admin: this.admin,
        month: this.month
      }; 
      
      this.rostersSubscription = this.rosterService.getCSVdata(data).subscribe(
        (res:any) => {  
          if(res !== "Roster not Published"){
            const blob = new Blob([res], { type: 'text/csv' });
            console.log(blob);
            
            FileSaver.saveAs(blob, 'roster_data.csv');
          }else{
            this.value = 'No Data for '+ this.month;  
            this.state = !this.state
            setTimeout(()=>{
              this.value = 'Download'
              this.state = !this.state
            }, 5000)
          }
          
          
        },
        error => {
          console.error('Error downloading CSV:', error);
          // Handle error
        }
      );
    }

    ngOnDestroy(){
      this.rostersSubscription.unsubscribe()
    }

     
}
