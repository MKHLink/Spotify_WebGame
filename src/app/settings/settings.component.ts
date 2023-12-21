import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  isEndlessSongs: boolean = true;
  isEndlessSongsBtnStyle: string = 'btn btn-primary';

  isFiveSongs: boolean = false;
  isFiveSongsBtnStyle: string = 'btn';

  isTwentySongs: boolean = false;
  isTwentySongsBtnStyle: string = 'btn';

  searchString: string = '';

  constructor() {}

  ngOnInit() {
    const settings = localStorage.getItem('spotify-pop-quiz-settings');

    if (settings) {
      const parsedSettings = JSON.parse(settings);
      this.isEndlessSongs = parsedSettings.isEndlessSongs;
      this.isFiveSongs = parsedSettings.isFiveSongs;
      this.isTwentySongs = parsedSettings.isTwentySongs;
      this.searchString = parsedSettings.searchString;
    } else {
      localStorage.setItem(
        'spotify-pop-quiz-settings',
        JSON.stringify({
          isEndlessSongs: true,
          isFiveSongs: false,
          isTwentySongs: false,
          searchString: '',
        })
      );
    }
    this.assignButtonClassses();
  }

  assignButtonClassses = () => {
    this.isEndlessSongsBtnStyle = this.isEndlessSongs ? 'btn btn-primary' : 'btn';
    this.isFiveSongsBtnStyle = this.isFiveSongs ? 'btn btn-primary' : 'btn';
    this.isTwentySongsBtnStyle = this.isTwentySongs ? 'btn btn-primary' : 'btn';
  };

  handleButtonClick = (buttonName: string) => {
    switch (buttonName) {
      case 'completely-random':
        this.isEndlessSongs = true;
        this.isFiveSongs = false;
        this.isTwentySongs = false;
        break;
      case 'based-on-genre':
        this.isEndlessSongs = false;
        this.isFiveSongs = true;
        this.isTwentySongs = false;
        break;
      case 'based-on-artist':
        this.isEndlessSongs = false;
        this.isFiveSongs = false;
        this.isTwentySongs = true;
        break;
    }

    localStorage.setItem(
      'spotify-pop-quiz-settings',
      JSON.stringify({
        isEndlessSongs: this.isEndlessSongs,
        isFiveSongs: this.isFiveSongs,
        isTwentySongs: this.isTwentySongs,
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
        isEndlessSongs: this.isEndlessSongs,
        isFiveSongs: this.isFiveSongs,
        isTwentySongs: this.isTwentySongs,
        searchString: this.searchString,
      })
    );
  };
}
