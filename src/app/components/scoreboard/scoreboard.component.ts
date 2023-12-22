import { Component, OnInit } from '@angular/core';
import { faker } from '@faker-js/faker';
import { ScoreboardService } from 'src/services/ScoreboardService';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css'],
})
export class ScoreboardComponent implements OnInit {
  scoreboard: any[] = [];

  topTenScores: any[] = [];

  constructor(private scoreboardService: ScoreboardService) {}

  ngOnInit(): void {
    this.scoreboardService.scoreboard.subscribe((scoreboard) => {
      this.scoreboard = scoreboard;
      this.topTenScores = scoreboard.slice(0, 10);
    });
    this.loadScoreboard();
    this.scoreboardService.setScoreboard(this.scoreboard);
  }

  loadScoreboard(): void {
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
      this.scoreboardService.setScoreboard(this.scoreboard);
      this.sortAndSaveScoreboard();
    }
  }

  addNewEntry(username: string, score: number): void {
    const storedData = localStorage.getItem('scoreboard');
    if (storedData) {
      this.scoreboard = JSON.parse(storedData);
    }

    const newEntry = {
      username: username,
      score: score,
    };
    this.scoreboard.push(newEntry);

    this.sortAndSaveScoreboard();
  }

  private sortAndSaveScoreboard(): void {
    this.scoreboard.sort((a, b) => b.score - a.score);
    this.topTenScores = this.scoreboard.slice(0, 10);
    this.scoreboardService.setScoreboard(this.scoreboard);
    localStorage.setItem('scoreboard', JSON.stringify(this.scoreboard));
  }
}
