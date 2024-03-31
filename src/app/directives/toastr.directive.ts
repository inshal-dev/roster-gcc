import { Directive, ElementRef, EventEmitter, Output } from '@angular/core'; 
import {Toast} from 'bootstrap';

@Directive({
  selector: '[appToastr]',
  standalone: true
})
export class ToastrDirective {
  private toast: any;

  constructor(private elementRef: ElementRef) {
    this.toast = new Toast(this.elementRef.nativeElement);
    console.log(this.toast)
  }

  show() {
    this.toast.show();
  }

  hide() {
    this.toast.hide();
  }
}
