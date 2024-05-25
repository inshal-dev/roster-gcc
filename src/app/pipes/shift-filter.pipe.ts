import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shiftFilter',
  standalone: true
})
export class ShiftFilterPipe implements PipeTransform {
  transform(roster: any[], selectedOption: any):any {
    if (!roster || !selectedOption) {
      return roster;
    } else {
      let rosterData = [];
      const { date, shift } = selectedOption;
  
      for (let i = 0; i < roster.length; i++) {
        const userRoster = roster[i]?.roster || [];
  
        for (let j = 0; j < userRoster.length; j++) {
          if (userRoster[j]?.dayNumber == date && userRoster[j]?.option == shift) {
            rosterData.push(roster[i]);
            break; // Exit the inner loop if a match is found
          }
        }
      }
  
      if (rosterData.length === 0) {
        console.log('No user for selected shifts');
      }
  
      return rosterData;
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