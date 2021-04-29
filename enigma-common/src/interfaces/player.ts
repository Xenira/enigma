import { Decimal } from "decimal.js";

export interface IPlayerView {
  money: number;
  moneyCapacity: number;

  science: number;
  scienceCapacity: number;

  industry: number;
  industryCapacity: number;

  energy: number;

  food: number;
  foodCapacity: number;
}
export interface IRessources {
  money: Decimal;
  science: Decimal;
  industry: Decimal;
  food: Decimal;
}
