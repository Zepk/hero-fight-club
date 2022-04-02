import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/services/hero.service';
import { Utils } from 'src/app/utils/utils';
import { MIN_HERO_ID, MAX_HERO_ID } from 'src/app/constants/constants';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  private heroIdSet = new Set<number>();

  constructor(
    private readonly heroService: HeroService,
    private utils: Utils,
  ) { }

  ngOnInit(): void {
  }

  public generateTeams() {
    this.generateRandomHeroIds();
    const heroIdArray = [...this.heroIdSet!]
    forkJoin(
      [].concat.apply([],
          heroIdArray.map(item => [
          this.heroService.getHero(item),
        ])
      )
    ).subscribe((response)=>{console.log(response)});
    
  }

  private generateRandomHeroIds(): void {
    this.heroIdSet.clear();
    while (this.heroIdSet.size < 10) {
      const heroId = this.utils.getRandomInt(MIN_HERO_ID, MAX_HERO_ID);
      this.heroIdSet.add(heroId);
      console.log(heroId);
    }
  }
}
