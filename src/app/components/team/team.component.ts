import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/services/hero.service';
import { Utils } from 'src/app/utils/utils';
import { MIN_HERO_ID, MAX_HERO_ID, MISTERY_MAN_IMAGE_URL } from 'src/app/constants/constants';
import { forkJoin } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  private heroIdSet = new Set<number>();
  public firstTeam: Array<Hero>;
  public secondTeam: Array<Hero>;
  public alternateImage = MISTERY_MAN_IMAGE_URL

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
    ).subscribe((response)=>{this.setTeams(response)});
    
  }

  // Creates the two hero teams with correct stats
  private setTeams(heroDataArray: Array<any>) {
    const firstHalf = heroDataArray.slice(0, 5);
    const secondHalf = heroDataArray.slice(5, 10);
    this.firstTeam = this.generateHeroes(firstHalf);
    this.secondTeam = this.generateHeroes(secondHalf);
    console.log(this.firstTeam);
    console.log(this.secondTeam);
  }

  private generateRandomHeroIds(): void {
    this.heroIdSet.clear();
    while (this.heroIdSet.size < 10) {
      const heroId = this.utils.getRandomInt(MIN_HERO_ID, MAX_HERO_ID);
      this.heroIdSet.add(heroId);
      console.log(heroId);
    }
  }

  // Returns an array of heroes with respective stats
  private generateHeroes(teamDataArray): Array<Hero> {
    let heroArray = Array<Hero>();
    const teamAlignement = this.getTeamAlignement(teamDataArray);
    teamDataArray.forEach((heroData) => {
      const {powerstats, id, alignment, name, image} = heroData
      const alignementModifier = this.getAlignementModifier(teamAlignement, alignment);
      const actualStamina = this.utils.getRandomInt(0, 10);

      // Some heroes have null values, so they are replaced with 0
      const baseStrength = powerstats.strength | 0;
      const baseDurability = powerstats.durability | 0;
      const basePower = powerstats.power | 0;
      const baseIntelect = powerstats.intelect | 0;
      const baseCombat = powerstats.combat | 0;
      const baseSpeed = powerstats.speed | 0;

      const hp = this.getHp(baseStrength, baseDurability, basePower, actualStamina);
      const strength = this.getStat(baseStrength, actualStamina, alignementModifier);
      const durability = this.getStat(baseDurability, actualStamina, alignementModifier);
      const power = this.getStat(basePower, actualStamina, alignementModifier);
      const intelect = this.getStat(baseIntelect, actualStamina, alignementModifier);
      const combat = this.getStat(baseCombat, actualStamina, alignementModifier);
      const speed = this.getStat(baseSpeed, actualStamina, alignementModifier)

      const newHero = {
        maxHp: hp,
        hp,
        strength,
        speed,
        intelect,
        durability,
        power,
        combat,
        id,
        image: image.url,
        name,
        alignementModifier
      } as Hero;

      heroArray.push(newHero);
    })
    return heroArray;
  }

  private getAlignementModifier(teamAlignement: string, heroAlignement: string) {
    if (heroAlignement === teamAlignement) return this.utils.getRandomInt(1, 10);
    return (this.utils.getRandomInt(1, 10) ** -1); 
  }

  // Calculates final stats using base stats and modifiers
  private getStat(baseStat: number, actualStamina: number, alignementModifier: number): number {
    return ((2 * baseStat + actualStamina) / 1.1) * alignementModifier;
  }
  
  private getHp(strength: number, durability: number, power: number, actualStamina: number): number {
    const baseHp = (strength * 0.8 + durability * 0.7 + power) / 2;
    const actualStaminaModifier = 1 + actualStamina/10
    return (baseHp * actualStaminaModifier) + 100
  }

  private getTeamAlignement(teamDataArray) {
    let alignment = 0
    teamDataArray.forEach((heroData) => {
      if (heroData.alignment == 'good') {
        alignment += 1;
      } else if (heroData.alignment == 'bad') {
        alignment -= 1;
      }
    })
    if (alignment > 0) { 
      return 'good'
    } else if (alignment < 0) { 
      return 'bad'
    } else return 'neutral'
  }
}
