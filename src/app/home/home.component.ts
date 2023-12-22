import { Component, OnInit } from '@angular/core';
// import fetchFromSpotify, { request } from '../../services/api';
import { fetchToken, getRandomSongs } from 'src/services/api';
import { Howl } from 'howler';
import { ScoreboardService } from 'src/services/ScoreboardService';

const TOKEN_KEY = 'whos-who-access-token';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  token: string = '';

  username: string = '';
  userScore: number = 0;
  scoreDifference: number = 0;
  totalScore: number = 0;

  songs: any[] = [];
  prevSongName: string = '';
  currentSongIndex: number = 0;
  sound: any;
  showPlayer: boolean = false;
  showModal: boolean = false;

  isEndlessSongs: any;
  isFiveSongs: any;
  isTwentySongs: any;

  constructor(private scoreboardService: ScoreboardService) {}

  ngOnInit() {
    const tokenKey = localStorage.getItem(TOKEN_KEY);

    if (tokenKey) {
      const token = JSON.parse(tokenKey);
      if (token.expiration > Date.now()) {
        this.token = token.value;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        this.getSpotifyAuthToken();
      }
    } else {
      this.getSpotifyAuthToken();
    }

    // Fetch settings from localStorage
    const settings = localStorage.getItem('spotify-pop-quiz-settings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      this.isEndlessSongs = parsedSettings.isEndlessSongs;
      this.isFiveSongs = parsedSettings.isFiveSongs;
      this.isTwentySongs = parsedSettings.isTwentySongs;
    }

    // Fetch songs based on settings

    this.fetchSongs();
  }

  fetchSongs = () => {
    if (this.token) {
      getRandomSongs(this.token).then((response: any) => {
        this.songs = [...this.songs, ...response.tracks.items.filter((track: any) => track.preview_url)];
        if (this.isFiveSongs) this.songs = this.songs.slice(0, 5);
        if (this.isTwentySongs) this.songs = this.songs.slice(0, 20);
      });
    }
  };

  receiveUsername = (valueEmitted: string) => {
    this.username = valueEmitted;
  };

  receiveUserScore = (valueEmitted: number) => {
    this.userScore = valueEmitted;
  };

  submitUsername = () => {
    this.showPlayer = true;
    this.initializeSound();
  };

  //howler js function to play spotify previews
  initializeSound = async () => {
    const previewUrl = this.songs[this.currentSongIndex]?.preview_url;
    if (previewUrl) {
      this.sound = new Howl({
        src: [previewUrl],
        html5: true,
        onplay: () => {
        },
      });
      this.play();
    }
  };

  //these three function binds the song details so they can be viewed real time
  getCurrentSongAlbumCover(): string {
    return this.songs[this.currentSongIndex]?.album?.images[0]?.url || '';
  }

  getCurrentSongName(): string {
    return this.songs[this.currentSongIndex]?.name || 'Unknown Song';
  }

  getCurrentSongArtist(): string {
    return this.songs[this.currentSongIndex]?.artists[0]?.name || 'Unknown Artist';
  }

  //skips to the next song
  nextSong = () => {
    if (this.sound) {
      this.sound.stop();
    }

    this.prevSongName = this.getCurrentSongName();

    if (this.currentSongIndex < this.songs.length - 1) {
      if (this.isEndlessSongs && this.currentSongIndex > this.songs.length - 5) {
        this.fetchSongs();
      }
      this.currentSongIndex++;
      this.initializeSound();
    } else {
      this.endGame();
    }
  };

  play(): void {
    if (this.sound && !this.sound.playing()) {
      this.sound.play();
    }
  }

  pause(): void {
    if (this.sound && this.sound.playing()) {
      this.sound.pause();
    }
  }

  //this function calculates the accuracy of a player's guess and scores them based on it
  submitGuess(): void {
    if (this.sound && this.userScore >= 0 && this.userScore <= 100) {
      const actualScore = this.songs[this.currentSongIndex]?.popularity || 0;
      this.scoreDifference = 100 - Math.abs(this.userScore - actualScore);

      this.totalScore += this.scoreDifference;
      this.totalScore = Math.round(this.totalScore);
    }
  }

  endGame(): void {
    if (this.sound) {
      this.sound.unload();
    }
    this.scoreboardService.addNewEntry(this.username, this.totalScore);

    this.showModal = true;
    this.showPlayer = false;
  }

  closeModal = (): void => {
    this.showModal = false;
    this.showPlayer = false;
    this.username = '';
  };

  //this function is used by the html so that when a use enters a guess it auto plays the next song
  handleEnterKey(): void {
    if (this.sound) this.sound.pause();
    this.submitGuess();
    this.nextSong();
  }

  getSpotifyAuthToken = () => {
    fetchToken().then(({ access_token, expires_in }: { access_token: string; expires_in: number }) => {
      const token = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
      this.token = token.value;
    });
  };
}
