import { Component, OnInit, Input } from '@angular/core';
import { ItunesService } from '../shared/itunes.service';

import { TreeNode } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  // providers: [ItunesService]
})
export class AlbumComponent implements OnInit {
  player: any;
  _artistId: number = 0;
  albumsTree: TreeNode[];

  @Input()
  set artistId(artistId: number) {
    this._artistId = artistId;

    this.getAlbums();
  }
  get artistId() { return this._artistId }

  constructor(private itunesService: ItunesService) { }

  ngOnInit(): void {
    this.player = new Audio();;
  }

  getAlbums() {
    this.itunesService.getAlbumsTree(this.artistId)
      .subscribe(
        data => this.albumsTree = data,
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
  }

  loadNode(event) {
    if (event.node) {
      console.log('Album Id: ' + event.node.data.albumId);
      this.itunesService.getTracks(event.node.data.albumId)
        .subscribe(
          nodes => event.node.children = nodes,
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
          }
        )
    }
  }

  // https://www.w3schools.com/tags/ref_av_dom.asp
  playAudio(url: string) {
    // let player = new Audio();
    this.player.pause();          // stop existing track 
    // this.player.currentTime = 0;    
    this.player.src = url;
    this.player.load();
    this.player.play();
  }

}
