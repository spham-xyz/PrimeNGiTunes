import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { Artist } from './models/artist';

// http://lightswitchhelpwebsite.com/Blog/tabid/61/EntryId/4305/Implementing-PrimeNG-FileUpload-in-a-Net-Core-Application.aspx
const API = {
  SEARCH: 'https://itunes.apple.com/search?',
  LOOKUP: 'https://itunes.apple.com/lookup?'
}

@Injectable()
export class ItunesService {

  constructor(private http: HttpClient) { }

  search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    )
  }
  
  searchEntries(term) {
    const url = `${API.SEARCH}callback=JSONP_CALLBACK&media=music&country=US&entity=musicArtist&limit=50&term=${term}`;

    return this.http.jsonp<Artist[]>(url, '')
      .pipe(
        map(data => data['results'])
      );
  }

  public getAlbums(artistId: number): Observable<any[]> {
    const url = `${API.LOOKUP}callback=JSONP_CALLBACK&entity=album&id=${artistId}`;

    console.log('Albums url: ' + url);
    return this.http.jsonp<any[]>(url, '')
      .pipe(
        map(arr => arr['results'].filter(row => row['wrapperType'] == 'collection')),
        map(rows => {
          return rows.map(row => Object.assign({}, { albumId: row.collectionId }, { albumName: row.collectionName }, { releaseDate: row.releaseDate }));
        })
      );
  }

  public getAlbumsTree(artistId: number): Observable<any[]> {
    const url = `${API.LOOKUP}callback=JSONP_CALLBACK&entity=album&id=${artistId}`;

    console.log('AlbumsTree url: ' + url);
    return this.http.jsonp<any[]>(url, '')
      .pipe(
        map(arr => arr['results'].filter(row => row['wrapperType'] == 'collection')),
        map(rows => {
          return rows.map(row => Object.assign({},
            {
              data:
                { albumId: row.collectionId, albumName: row.collectionName, releaseDate: row.releaseDate }
            },
            { leaf: false })
          );
        })
      );
  }

  public getTracks(albumId: number): Observable<any[]> {
    const url = `${API.LOOKUP}callback=JSONP_CALLBACK&entity=song&id=${albumId}`;

    console.log('Tracks url: ' + url);
    return this.http.jsonp(url, '')
      .pipe(
        map(arr => arr['results'].filter(row => row['wrapperType'] == 'track')),
        map(rows => {
          return rows.map(row => Object.assign({},
            {
              data:
                { albumId: row.trackName, albumName: row.previewUrl, releaseDate: '' }
            })
          )
        })
      );
  }

}
