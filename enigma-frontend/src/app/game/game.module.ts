import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import { GameService } from './game.service';

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule],
  exports: [GameComponent],
  providers: [GameService],
})
export class GameModule {}
