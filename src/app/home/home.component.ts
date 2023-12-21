import { Component, OnInit } from '@angular/core';
// import fetchFromSpotify, { request } from '../../services/api';
import { fetchToken, getRandomSongs, searchSpotifyByGenre, searchSpotifyByArtist } from 'src/services/api';
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
  userScore: number =0;
  totalScore: number = 0;

  songs: any [] =[];
  currentSongIndex: number = 0;
  sound:any;
  showPlayer: boolean = false;
  showModal:boolean = false;

  isCompletelyRandom: any;
  isBasedOnGenre: any;
  isBasedOnArtist: any;
  searchString: any;

  constructor(private scoreboardService: ScoreboardService) {}

  ngOnInit(): void {
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
      this.isCompletelyRandom = parsedSettings.isCompletelyRandom;
      this.isBasedOnGenre = parsedSettings.isBasedOnGenre;
      this.isBasedOnArtist = parsedSettings.isBasedOnArtist;
      this.searchString = parsedSettings.searchString;
    }
  
    // Fetch songs based on settings
    this.fetchSongs();
  }
  
  //depending on the settings, uses the appropiate api
  fetchSongs(): void {
    if (this.token) {
      if (this.isCompletelyRandom) {
        getRandomSongs(this.token).then((response: any) => {
          console.log('Random songs: ', response);
          this.songs = response.tracks.items.filter((track: any) => track.preview_url);
          console.log(this.songs);
        });
      } else if (this.isBasedOnArtist) {
        searchSpotifyByArtist(this.token, this.searchString).then((response: any) => {
          console.log('Artist search results: ', response);
          this.songs = response.tracks.items.filter((track: any) => track.preview_url);
          console.log(this.songs);
        });
      } else if (this.isBasedOnGenre) {
        searchSpotifyByGenre(this.token, this.searchString).then((response: any) => {
          console.log('Genre search results: ', response);
          this.songs = response.tracks.items.filter((track: any) => track.preview_url);
          console.log(this.songs);
        });
      }
    }
  }
  
 
  receiveUsername = (valueEmitted: string) => {
    this.username = valueEmitted;
  };

  submitUsername = () => {
    console.log('Username: ', this.username);
    this.showPlayer = true;
    this.initializeSound();
  };

  //howler js function to play spotify previews
  initializeSound(): void {
    const previewUrl = this.songs[this.currentSongIndex]?.preview_url;
    if (previewUrl) {
      this.sound = new Howl({
        src: [previewUrl],
        html5: true,
        onplay: () => {
          console.log('Playing');
        }
      });
      this.play();
    }
  }

  //these three function binds the song details so they can be viewed real time
  getCurrentSongAlbumCover(): string {
    return this.songs[this.currentSongIndex]?.album?.images[0]?.url || 'default-cover.jpg';
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

    if (this.currentSongIndex < this.songs.length - 1) {
      this.currentSongIndex++;
    } else {
      this.currentSongIndex = 0;
    }

    this.initializeSound();
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
    if (this.sound && this.userScore >= 1 && this.userScore <= 100) {
      const actualScore = this.songs[this.currentSongIndex]?.popularity || 0;
      console.log("pop " + actualScore);
  
      let scoreDifference: number;
  
      if (this.userScore < actualScore) {
        scoreDifference = Math.abs((this.userScore / actualScore) * 100);
      } else {
        scoreDifference = Math.abs((actualScore / this.userScore) * 100);
      }
  
      this.totalScore += scoreDifference;
      this.totalScore = Math.round(this.totalScore); 
      console.log(`User's Score: ${this.totalScore}`);
    }
  }
  

  endGame(): void{
    if (this.sound) {
      this.sound.unload(); 
    }
    this.scoreboardService.addNewEntry(this.username, this.totalScore);
    
    this.showModal = true;
  }

  closeModal=(): void=>{
    console.log('click!!');
    this.showModal = false;
    this.showPlayer=false;
  }

  //this function is used by the html so that when a use enters a guess it auto plays the next song
handleEnterKey(): void {
  this.nextSong();
  this.submitGuess();
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

