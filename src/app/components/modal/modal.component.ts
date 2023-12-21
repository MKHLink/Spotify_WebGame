import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  userScore: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
