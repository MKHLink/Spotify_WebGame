import { Component, OnInit } from '@angular/core';
// import fetchFromSpotify, { request } from '../../services/api';
import { fetchToken, searchSpotifyByGenre, searchSpotifyByArtist } from 'src/services/api';

const TOKEN_KEY = 'whos-who-access-token';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  token: string = '';

  username: string = '';

  constructor() {}

  ngOnInit(): void {
    const tokenKey = localStorage.getItem(TOKEN_KEY);
    console.log('tokenKey: ', tokenKey);

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

    searchSpotifyByArtist(this.token, 'The Beatles').then((response: any) => {
      console.log('The Beatles search results: ', response);
    });
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
