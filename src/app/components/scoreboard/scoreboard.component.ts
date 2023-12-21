import { Component, OnInit } from '@angular/core';
import { faker } from '@faker-js/faker';


@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
})
export class ScoreboardComponent implements OnInit {
  scoreboard: any[] = [];

  topTenScores: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadScoreboard();
    this.topTenScores = this.scoreboard.slice(0, 10);
  }

  private loadScoreboard(): void {
    const storedData = localStorage.getItem('scoreboard');

    if (storedData) {
      this.scoreboard = JSON.parse(storedData);
    }

    if (this.scoreboard.length < 10) {
      for (let i = this.scoreboard.length; i < 10; i++) {
        const fakeData = {
          username: faker.internet.userName(),
          score: faker.number.int({ min: 1, max: 500 }),
        };
        this.scoreboard.push(fakeData);
      }

      this.sortAndSaveScoreboard();
    }
  }

  //function to sort data by score before saving
  sortAndSaveScoreboard(): void {
    this.scoreboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('scoreboard', JSON.stringify(this.scoreboard));
  }

  //function to add a new entry via other components, this function checks if the new entry's scroe is high enough to earn a place in the scoreboard
  addNewEntry(username: string, score: number): void {
    const newEntry = {
      username: username,
      score: score,
    };

    this.scoreboard.push(newEntry);
    this.sortAndSaveScoreboard();
    this.topTenScores = this.scoreboard.slice(0, 10);
  }
}
