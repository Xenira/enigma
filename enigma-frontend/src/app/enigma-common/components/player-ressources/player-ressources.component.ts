import { Component, OnInit } from '@angular/core';
import { IPlayerData, PlayerService } from '../../services/player.service';

@Component({
  selector: 'enigma-player-ressources',
  templateUrl: './player-ressources.component.html',
  styleUrls: ['./player-ressources.component.scss'],
})
export class PlayerRessourcesComponent implements OnInit {
  public playerData?: IPlayerData;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getPlayerData().subscribe((data) => {
      this.playerData = data;
    });
  }
}
