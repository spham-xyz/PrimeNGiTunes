import { Component, OnInit, VERSION } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import { Message } from 'primeng/components/common/api';

import { Artist } from '../shared/models/artist';
import { ItunesService } from '../shared/itunes.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  // providers: [ItunesService]
})
export class ArtistComponent implements OnInit {
  searchTerm$ = new Subject<string>();
  msgs: Message[] = [];

  // artists: Array<Artist> = [];
  artists: Artist[];
  selectedArtist: Artist;
  artistId: number = 0;
  ngVersion: string;

  constructor(private itunesService: ItunesService) {
    this.ngVersion = `${VERSION.full}`;
    
    this.itunesService.search(this.searchTerm$)
      .subscribe(
        data => {
          this.artistId = 0;
          this.artists = data;
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
  }

  ngOnInit() {
  }

  rowSelect(event) {
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'Info Message', detail: this.selectedArtist.artistId + ': ' + this.selectedArtist.artistName });

    this.artistId = this.selectedArtist.artistId;
  }
}
