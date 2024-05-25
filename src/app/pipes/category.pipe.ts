import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category',
  standalone: true
})
export class CategoryPipe implements PipeTransform {

  transform( roster:Array<any>, categorySelected: string,): any {
     if(categorySelected){
      let rosterdata = []  
      for(let i=0; i<= roster.length; i++){ 
        if(roster[i]?.category == categorySelected){
          rosterdata.push(roster[i])
        }else{
          console.log('')
        }
       } 
       return roster = rosterdata
     }else{
      return roster
     }
    
  }

}
