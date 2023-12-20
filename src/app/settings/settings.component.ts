import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  isCompletelyRandom: boolean = true;
  isCompletelyRandomBtnStyle: string = 'btn btn-primary';

  isBasedOnGenre: boolean = false;
  isBasedOnGenreBtnStyle: string = 'btn';

  isBasedOnArtist: boolean = false;
  isBasedOnArtistBtnStyle: string = 'btn';

  searchString: string = '';

  constructor() {}

  ngOnInit() {
    const settings = localStorage.getItem('spotify-pop-quiz-settings');

    if (settings) {
      const parsedSettings = JSON.parse(settings);
      this.isCompletelyRandom = parsedSettings.isCompletelyRandom;
      this.isBasedOnGenre = parsedSettings.isBasedOnGenre;
      this.isBasedOnArtist = parsedSettings.isBasedOnArtist;
      this.searchString = parsedSettings.searchString;
    } else {
      localStorage.setItem(
        'spotify-pop-quiz-settings',
        JSON.stringify({
          isCompletelyRandom: true,
          isBasedOnGenre: false,
          isBasedOnArtist: false,
          searchString: '',
        })
      );
    }
    this.assignButtonClassses();
  }

  assignButtonClassses = () => {
    this.isCompletelyRandomBtnStyle = this.isCompletelyRandom ? 'btn btn-primary' : 'btn';
    this.isBasedOnGenreBtnStyle = this.isBasedOnGenre ? 'btn btn-primary' : 'btn';
    this.isBasedOnArtistBtnStyle = this.isBasedOnArtist ? 'btn btn-primary' : 'btn';
  };

  handleButtonClick = (buttonName: string) => {
    switch (buttonName) {
      case 'completely-random':
        this.isCompletelyRandom = true;
        this.isBasedOnGenre = false;
        this.isBasedOnArtist = false;
        break;
      case 'based-on-genre':
        this.isCompletelyRandom = false;
        this.isBasedOnGenre = true;
        this.isBasedOnArtist = false;
        break;
      case 'based-on-artist':
        this.isCompletelyRandom = false;
        this.isBasedOnGenre = false;
        this.isBasedOnArtist = true;
        break;
    }

    localStorage.setItem(
      'spotify-pop-quiz-settings',
      JSON.stringify({
        isCompletelyRandom: this.isCompletelyRandom,
        isBasedOnGenre: this.isBasedOnGenre,
        isBasedOnArtist: this.isBasedOnArtist,
        searchString: this.searchString,
      })
    );

    this.assignButtonClassses();
  };

  receiveInput = (valueEmitted: string) => {
    this.searchString = valueEmitted;
    localStorage.setItem(
      'spotify-pop-quiz-settings',
      JSON.stringify({
        isCompletelyRandom: this.isCompletelyRandom,
        isBasedOnGenre: this.isBasedOnGenre,
        isBasedOnArtist: this.isBasedOnArtist,
        searchString: this.searchString,
      })
    );
  };
}
