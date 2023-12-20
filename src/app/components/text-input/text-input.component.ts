import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent implements OnInit {
  inputValue: string = '';

  isTextType: boolean = true;

  isNumberType: boolean = false;

  @Input() inputType: 'text' | 'number' = 'text';

  @Input() placeholder: string = '';

  @Output() onInputChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() onEnter: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    this.isTextType = this.inputType === 'text';
    this.isNumberType = this.inputType === 'number';
  }

  setInputValue(value: string) {
    this.inputValue = value;
    this.onInputChange.emit(value);
  }

  handleEnter() {
    this.onEnter.emit();
  }
}
