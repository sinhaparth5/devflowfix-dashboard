import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styles: ``
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Input() className = '';
  @Input() showCloseButton = true;
  @Input() isFullscreen = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.updateBodyOverflow();
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  private updateBodyOverflow() {
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  ngOnChanges() {
    this.updateBodyOverflow();
  }

  onBackdropClick(event: MouseEvent) {
    if (!this.isFullscreen) {
      this.close.emit();
    }
  }

  onContentClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (this.isOpen && event.key === 'Escape') {
      this.close.emit();
    }
  }
}