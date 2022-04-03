export interface Hero {
  hp: number;
  maxHp: number;
  actualStamina?: number;
  strength: number;
  speed: number;
  intelect: number;
  durability: number;
  power: number;
  combat: number;
  id: number;
  image?: string;
  name: string;
  alignementModifier: number;
}
