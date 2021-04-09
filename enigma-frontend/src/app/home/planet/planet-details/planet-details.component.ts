import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IPlanet, IPlanetDetails, PlanetService } from '../planet.service';

@Component({
  selector: 'enigma-planet-details',
  templateUrl: './planet-details.component.html',
  styleUrls: ['./planet-details.component.scss'],
})
export class PlanetDetailsComponent implements OnInit {
  planet?: Observable<IPlanetDetails>;

  constructor(
    private route: ActivatedRoute,
    private planetService: PlanetService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.planet = this.planetService.getPlanet(params.id);
    });
  }
}
