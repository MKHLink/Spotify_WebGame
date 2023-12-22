import { Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScoreboardService {
  // private scoreboard: any[] = [];
  private scoreboardSource = new BehaviorSubject<any[]>([]);
  scoreboard = this.scoreboardSource.asObservable();

  setScoreboard(scoreboard: any[]) {
    this.scoreboardSource.next(scoreboard);
  }
}
