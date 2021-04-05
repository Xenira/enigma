import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface ITile {
  image: string;
}

@Component({
  selector: 'enigma-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit {
  @Input()
  size = 128;

  @Input()
  shift = false;

  @Input()
  shiftDirection: 'left' | 'right' = 'left';

  @Output()
  selected = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  tileClicked(): void {
    this.selected.emit();
  }
}
