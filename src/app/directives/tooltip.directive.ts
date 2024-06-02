import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText!: string;
  tooltip!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip && this.tooltipText) {
      this.tooltip = this.renderer.createElement('span');
      this.renderer.appendChild(
        this.el.nativeElement,
        this.tooltip
      );
      this.renderer.addClass(this.tooltip, 'tooltip-text'); 
      this.renderer.setStyle(this.tooltip, 'background-color', '#333');
      this.renderer.setStyle(this.tooltip, 'color', '#fff');
      this.renderer.setStyle(this.tooltip, 'border-radius', '6px');
      this.renderer.setStyle(this.tooltip, 'padding', '5px 10px');
      this.renderer.setStyle(this.tooltip, 'position', 'absolute');
      const text = this.renderer.createText(this.tooltipText);
      this.renderer.appendChild(this.tooltip, text);
      this.setPosition();
    }
    this.renderer.setStyle(this.tooltip, 'visibility', 'visible');
    this.renderer.setStyle(this.tooltip, 'opacity', '1');
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.renderer.setStyle(this.tooltip, 'visibility', 'hidden');
      this.renderer.setStyle(this.tooltip, 'opacity', '0');
    }
  }

  private setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    const top = hostPos.top - tooltipPos.height - 10;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }

}
