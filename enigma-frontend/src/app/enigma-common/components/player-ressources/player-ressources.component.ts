import { Component, OnInit } from '@angular/core';
import { IPlayerView } from '../../../../../../enigma-backend/src/views/player.view';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'enigma-player-ressources',
  templateUrl: './player-ressources.component.html',
  styleUrls: ['./player-ressources.component.scss'],
})
export class PlayerRessourcesComponent implements OnInit {
  public playerData?: IPlayerView;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getPlayerData().subscribe((data) => {
      console.log(data);
      this.playerData = data;
    });
  }
}
