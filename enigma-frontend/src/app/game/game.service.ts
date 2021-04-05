import { Injectable } from '@angular/core';
import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Rectangle } from '@pixi/math';

export interface IShip {
  name: string;
  rooms: IRoom[];
}

export interface IRoom extends IWithLocation {
  name: string;
  color: number;
  width: number;
  height: number;
  grid: IGrid;
}

export interface IGrid {
  width: number;
  height: number;
}

export interface IRoomComponent extends IWithLocation {
  color: number;
}

export interface IWithLocation {
  x: number;
  y: number;
}

@Injectable()
export class GameService {
  constructor() {}

  buildShip(shipLayout: IShip): Container {
    const ship = new Container();
    ship.name = shipLayout.name;
    shipLayout.rooms.forEach((roomLayout) => {
      const room = this.buildRoom(roomLayout);
      ship.addChild(room);
      room.setTransform(roomLayout.x + 16, roomLayout.y + 16);
    });

    const bounds = this.getShipSize(shipLayout.rooms);
    const box = new Graphics();
    box.beginFill(0x78cce2);
    box.lineStyle(2, 0x78cce2);
    box.drawRoundedRect(0, 0, bounds.width, bounds.height, 8);
    box.endFill();
    ship.addChildAt(box, 0);

    return ship;
  }

  private getShipSize(rooms: IRoom[]): Rectangle {
    let width = 32;
    let height = 32;

    rooms.forEach((room) => {
      const x = room.x + room.width + 32;
      const y = room.y + room.height + 32;
      if (x > width) {
        width = x;
      }
      if (y > height) {
        height = y;
      }
    });

    return new Rectangle(0, 0, width, height);
  }

  private buildRoom(roomLayout: IRoom): Container {
    const room = new Container();
    room.name = roomLayout.name;

    const box = new Graphics();
    box.lineStyle(2, roomLayout.color);
    box.drawRect(0, 0, roomLayout.width, roomLayout.height);
    box.endFill();
    room.addChild(box);

    const grid = this.buildComponentGrid(roomLayout.grid, roomLayout.color);
    grid.setTransform(8, 8);
    room.addChild(grid);

    return room;
  }

  private buildComponentGrid(gridLayout: IGrid, color: number): Container {
    const grid = new Container();

    const outer = new Graphics();
    outer.beginFill(color, 0.66);
    outer.lineStyle(2, color);
    outer.drawRect(0, 0, gridLayout.width * 32, gridLayout.height * 32);
    outer.endFill();
    grid.addChild(outer);

    for (let i = 0; i < gridLayout.width; i++) {
      for (let j = 0; j < gridLayout.height; j++) {
        const box = new Graphics();
        box.lineStyle(1, color);
        box.drawRect(i * 32, j * 32, 32, 32);
        grid.addChild(box);
      }
    }

    return grid;
  }
}
