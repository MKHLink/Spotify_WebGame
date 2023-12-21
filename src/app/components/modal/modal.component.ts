import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() username: string = '';
  @Input() totalScore: number = 0;
  @Input() onClose: () => void=()=> {};
  constructor() { }

  ngOnInit(): void {
  }

  closeModal(): void{
    this.onClose();
  }
}
