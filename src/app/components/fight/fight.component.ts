import { Component, OnInit } from '@angular/core';
import { HeroService } from 'src/app/services/hero.service';
import { Utils } from 'src/app/utils/utils';
import { MIN_HERO_ID, MAX_HERO_ID, MISTERY_MAN_IMAGE_PATH, ATTACK_TYPES, MENTAL_ATTACK,
         FAST_ATTACK, STRONG_ATTACK, FIRST_TEAM_NAME, SECOND_TEAM_NAME, EMAIL_PATTERN} from 'src/app/constants/constants';
import { forkJoin } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss']
})
export class FightComponent implements OnInit {
  private heroIdSet = new Set<number>();
  public firstTeam: Array<Hero>;
  public secondTeam: Array<Hero>;
  public firstTeamAliveHeroes: Array<Hero>;
  public secondTeamAliveHeroes: Array<Hero>;
  public alternateImage = MISTERY_MAN_IMAGE_PATH;
  public fightText = '';
  public round = 0;
  public teamsReady = false;
  public firstLoad = true;
  public firstTeamName = FIRST_TEAM_NAME;
  public secondTeamName = SECOND_TEAM_NAME;
  public emailSent = false;
  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]],
  });

  constructor(
    private readonly heroService: HeroService,
    private utils: Utils,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.generateTeams();
  }

  public get canFight(): boolean {
    return this.teamsReady && this.firstTeamAliveHeroes.length > 0 && this.secondTeamAliveHeroes.length > 0;
  }

  public get endText(): string {
    if (this.canFight) { return ''; }
    if (this.firstTeamAliveHeroes.length > 0 && this.secondTeamAliveHeroes.length === 0 ) {
      return `¡El ${this.firstTeamName} Ganó!`;
    }
    if (this.secondTeamAliveHeroes.length > 0 && this.firstTeamAliveHeroes.length === 0) {
      return `¡El ${this.secondTeamName} Ganó!`;
    }
    return '¡La batalla fué un empate!';
  }

  public addFightText(hero: Hero, enemyObjective: Hero, attackType: string, damageDone: number): void {
    const textDamage = Math.floor(damageDone);
    const textHp = Math.floor(enemyObjective.hp);
    this.fightText = this.fightText.concat(`${hero.name} ha utilizado un ataque ${attackType} contra ${enemyObjective.name}, realizando ${textDamage} de daño\n`);
    this.fightText = this.fightText.concat(`${enemyObjective.name} tiene ${textHp} HP restante\n\n`);
  }

  public fullFight(): void {
    while (this.canFight) {
      this.fightOneRound();
    }
  }

  public fightOneRound(): void {
    if (!this.canFight) { return; }
    this.round += 1;
    this.fightText = this.fightText.concat(`\nINICIA LA RONDA#${this.round}\n\n`);
    this.attackTeam(this.firstTeamAliveHeroes, this.secondTeamAliveHeroes);
    this.attackTeam(this.secondTeamAliveHeroes, this.firstTeamAliveHeroes);
    this.setAliveHeroes();
  }

  public sendEmail(): void {
    let emailText = `El equipo alpha está formado por: `;
    this.firstTeam.forEach((hero, index) => {
      if (index !== this.firstTeam.length - 1) {
        emailText += ` ${hero.name}, `;
      } else {
        emailText += ` ${hero.name}.`;
      }
    });

    emailText += '<br><br>El equipo beta está formado por:';
    this.secondTeam.forEach((hero, index) => {
      if (index !== this.secondTeam.length - 1) {
        emailText += ` ${hero.name}, `;
      } else {
        emailText += ` ${hero.name}.`;
      }
    });

    emailText += `<br><br><b>${this.endText}</b>`;

    this.heroService.sendEmail('Resumen de la Batalla', emailText, this.form.value.email);
    this.emailSent = true;
  }

  private setAliveHeroes(): void {
    this.firstTeam.forEach((hero) => {
      if (hero.hp <= 0) {
        this.firstTeamAliveHeroes = this.firstTeamAliveHeroes.filter(aliveHero => (aliveHero.hp > 0));
      }
    });
    this.secondTeam.forEach((hero) => {
      if (hero.hp <= 0) {
        this.secondTeamAliveHeroes = this.secondTeamAliveHeroes.filter(aliveHero => (aliveHero.hp > 0));
      }
    });
  }

  private attackTeam(attackingTeamAlive: Array<Hero>, defendingTeamAlive: Array<Hero>): void {
    attackingTeamAlive.forEach(hero => {
      const attackType = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
      const damageDone = this.calculateDamageDone(hero, attackType);
      const radomNumber = Math.floor(Math.random() * defendingTeamAlive.length);
      const enemyObjective = defendingTeamAlive[radomNumber];
      enemyObjective.hp -= damageDone;
      if (enemyObjective.hp < 0) { enemyObjective.hp = 0; }
      this.addFightText(hero, enemyObjective, attackType, damageDone);
    });
  }


  private calculateDamageDone(hero: Hero, attackType: string): number {
    switch (attackType) {
      case MENTAL_ATTACK:
        return (hero.intelect * 0.7 + hero.speed * 0.2 + hero.combat * 0.1) * hero.alignementModifier;
      case STRONG_ATTACK:
        return (hero.strength * 0.6 + hero.power * 0.2 + hero.combat * 0.2) * hero.alignementModifier;
      case FAST_ATTACK:
        return (hero.speed * 0.55 + hero.durability * 0.25 + hero.strength * 0.2) * hero.alignementModifier;
    }
  }

  public generateTeams(): void {
    this.teamsReady = false;
    this.round = 0;
    this.emailSent = false;
    this.fightText = '';
    this.generateRandomHeroIds();
    const heroIdArray = [...this.heroIdSet!];
    forkJoin(
      [].concat.apply([],
          heroIdArray.map(item => [
          this.heroService.getHero(item),
        ])
      )
    ).subscribe((response) => { this.setTeams(response); } );
  }

  // Creates the two hero teams with correct stats
  private setTeams(heroDataArray: Array<any>): void {
    const firstHalf = heroDataArray.slice(0, 5);
    const secondHalf = heroDataArray.slice(5, 10);
    this.firstTeam = this.generateHeroes(firstHalf);
    this.firstTeamAliveHeroes = this.firstTeam;
    this.secondTeam = this.generateHeroes(secondHalf);
    this.secondTeamAliveHeroes = this.secondTeam;
    this.teamsReady = true;
    this.firstLoad = false;
  }

  private generateRandomHeroIds(): void {
    this.heroIdSet.clear();
    while (this.heroIdSet.size < 10) {
      const heroId = this.utils.getRandomInt(MIN_HERO_ID, MAX_HERO_ID);
      this.heroIdSet.add(heroId);
    }
  }

  // Returns an array of heroes with respective stats
  private generateHeroes(teamDataArray): Array<Hero> {
    const heroArray = Array<Hero>();
    const teamAlignement = this.getTeamAlignement(teamDataArray);
    teamDataArray.forEach((heroData) => {
      const {powerstats, id, alignment, name, image} = heroData;
      const alignementModifier = this.getAlignementModifier(teamAlignement, alignment);
      const actualStamina = this.utils.getRandomInt(0, 10);

      // Some heroes have null values, so they are replaced with 0
      const baseStrength = powerstats?.strength | 0;
      const baseDurability = powerstats?.durability | 0;
      const basePower = powerstats?.power | 0;
      const baseIntelect = powerstats?.intelect | 0;
      const baseCombat = powerstats?.combat | 0;
      const baseSpeed = powerstats?.speed | 0;

      const hp = this.getHp(baseStrength, baseDurability, basePower, actualStamina);
      const strength = this.getStat(baseStrength, actualStamina, alignementModifier);
      const durability = this.getStat(baseDurability, actualStamina, alignementModifier);
      const power = this.getStat(basePower, actualStamina, alignementModifier);
      const intelect = this.getStat(baseIntelect, actualStamina, alignementModifier);
      const combat = this.getStat(baseCombat, actualStamina, alignementModifier);
      const speed = this.getStat(baseSpeed, actualStamina, alignementModifier);

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
    });
    return heroArray;
  }

  private getAlignementModifier(teamAlignement: string, heroAlignement: string): number {
    if (heroAlignement === teamAlignement) { return this.utils.getRandomInt(1, 10); }
    return (this.utils.getRandomInt(1, 10) ** -1);
  }

  // Calculates final stats using base stats and modifiers
  private getStat(baseStat: number, actualStamina: number, alignementModifier: number): number {
    return ((2 * baseStat + actualStamina) / 1.1) * alignementModifier;
  }

  private getHp(strength: number, durability: number, power: number, actualStamina: number): number {
    const baseHp = (strength * 0.8 + durability * 0.7 + power) / 2;
    const actualStaminaModifier = 1 + actualStamina / 10;
    return (baseHp * actualStaminaModifier) + 100;
  }

  private getTeamAlignement(teamDataArray: any[]): string {
    let alignment = 0;
    teamDataArray.forEach((heroData) => {
      if (heroData?.alignment === 'good') {
        alignment += 1;
      } else if (heroData?.alignment === 'bad') {
        alignment -= 1;
      }
    });

    if (alignment > 0) {
      return 'good';
    } else if (alignment < 0) {
      return 'bad';
    }
    return 'neutral';
  }
}

