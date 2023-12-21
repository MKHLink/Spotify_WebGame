import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScoreboardService {
  private scoreboard: any[] = [];

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
    localStorage.setItem('scoreboard', JSON.stringify(this.scoreboard));
  }
}
