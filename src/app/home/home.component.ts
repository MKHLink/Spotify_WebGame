import { Component, OnInit } from '@angular/core';
import { random } from 'lodash';
// import fetchFromSpotify, { request } from '../../services/api';
import { fetchToken, getRandomSongs, searchSpotifyByGenre, searchSpotifyByArtist } from 'src/services/api';
import { Howl, Howler } from 'howler';

const TOKEN_KEY = 'whos-who-access-token';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  token: string = '';

  username: string = '';

  songs: any [] =[];
  currentSongIndex: number = 0;
  sound:any;
  showPlayer: boolean = false;
  isCompletelyRandom: any;
  isBasedOnGenre: any;
  isBasedOnArtist: any;
  searchString: any;

  constructor() {}

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

  getCurrentSongAlbumCover(): string {
    return this.songs[this.currentSongIndex]?.album?.images[0]?.url || 'default-cover.jpg';
  }

  getCurrentSongName(): string {
    return this.songs[this.currentSongIndex]?.name || 'Unknown Song';
  }

  getCurrentSongArtist(): string {
    return this.songs[this.currentSongIndex]?.artists[0]?.name || 'Unknown Artist';
  }

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

