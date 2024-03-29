import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent implements OnInit {
  inputValue: number = 0;

  @Input() control: FormControl = new FormControl();

  @Input() placeholder: string = 'Enter a number';

  @Output() onInputChange: EventEmitter<number> = new EventEmitter<number>();

  @Output() onEnter: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  setInputValue(value: string) {
    let num = Number(value);
    num = num < 0 ? 0 : num > 100 ? 100 : num;
    this.inputValue = num;
    this.onInputChange.emit(num);
  }

  handleEnter() {
    this.onEnter.emit();
  }
}
