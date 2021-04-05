import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Application } from 'pixi.js';
import { GameService, IShip } from './game.service';

const smallShip: IShip = {
  name: 'Small Ship',
  rooms: [
    {
      color: 0x218766,
      grid: { height: 2, width: 2 },
      height: 96,
      width: 96,
      name: 'Bridge',
      x: 156,
      y: 56,
    },
    {
      color: 0xe0e040,
      grid: {
        height: 2,
        width: 2,
      },
      height: 96,
      width: 128,
      name: 'Engineering',
      x: 0,
      y: 128,
    },
    {
      color: 0x779fe7,
      grid: {
        height: 2,
        width: 2,
      },
      height: 96,
      width: 128,
      name: 'Shield',
      x: 0,
      y: 0,
    },
  ],
};

@Component({
  selector: 'enigma-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('gameContainer')
  gameContainer?: ElementRef<HTMLDivElement>;

  private app?: Application;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.app = new Application({
      width: this.gameContainer?.nativeElement.clientWidth,
      height: this.gameContainer?.nativeElement.clientHeight,
      backgroundAlpha: 0.5,
      antialias: true,
    });

    this.gameContainer?.nativeElement.appendChild(this.app.view);

    this.app.stage.addChild(this.gameService.buildShip(smallShip));
  }
}
