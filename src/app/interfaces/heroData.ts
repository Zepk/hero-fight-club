export class HeroData {
  public image: Image;
  public powerstats: PowerStats;
  public id: string;
  public name: string;
  public alignment: string;
}

export interface PowerStats {
  combat: string;
  durability: string;
  intelligence: string;
  power: string;
  speed: string;
  strength: string;
}

export interface Image {
  url: string;
}
