import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shiftFilter',
  standalone: true
})
export class ShiftFilterPipe implements PipeTransform {
  transform(roster: any[], selectedOption: any):any {
   
    if (!roster || !selectedOption) {
      return roster;
    }else{
       
      let rosterdata = []  
  ///     console.log(rosterdata[0].roster[1]?.dayNumber);
       const {date, shift} = selectedOption 
       for(let i=0; i<= roster.length; i++){ 
        if(roster[i]?.roster[date]?.option == shift){
          rosterdata.push(roster[i])
        }else{
          console.log('')
        }
       } 
       return roster = rosterdata
    }
    
  }
}
/*
var deptList1 = deptList.map(function(item) {  
    var totalSal = employees.filter(function(record) {  
        return record.dept === item  
    }).reduce(function(tot, employee) {  
        return tot + employee.salary;  
    }, 0)  
    return {  
        'dept': item,  
        'total': totalSal  
    }  
}, 0); 
*/