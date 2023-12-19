import { Component, OnInit } from '@angular/core';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  fakeScoreboard: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadFakeScoreboard();
  }

  private loadFakeScoreboard(): void {
    const storedData = localStorage.getItem('fakeScoreboard');

    if (storedData) {
      this.fakeScoreboard = JSON.parse(storedData);
    }

    if (this.fakeScoreboard.length < 10) {
      for (let i = this.fakeScoreboard.length; i < 10; i++) {
        const fakeData = {
          username: faker.internet.userName(),
          score: faker.number.int({ min: 1, max: 9000 })
        };
        this.fakeScoreboard.push(fakeData);
      }

      this.sortAndSaveScoreboard();
    }
  }

  //function to sort data by score before saving
  sortAndSaveScoreboard(): void {
    this.fakeScoreboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('fakeScoreboard', JSON.stringify(this.fakeScoreboard));
  }

  //function to add a new entry via other components, this function checks if the new entry's scroe is high enough to earn a place in the scoreboard
  addNewEntry(username: string, score: number): void {
    const newEntry = {
      username: username,
      score: score
    };

    const lowerScore = this.fakeScoreboard.find(entry=>entry.score<score);

    if(lowerScore){
      const i = this.fakeScoreboard.indexOf(lowerScore);
      this.fakeScoreboard[i] = newEntry;
      this.sortAndSaveScoreboard();
    }else if(this.fakeScoreboard.length<10){
      this.fakeScoreboard.push(newEntry);
      this.sortAndSaveScoreboard();
    } 
  }
}