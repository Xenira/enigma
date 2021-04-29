import Decimal from "decimal.js";
import { IRessources, ITechView } from "../../../interfaces";
import { Consumer } from "./consumer";

export class ResearchConsumer extends Consumer {
  private _research: ITechView[] = [];
  set research(value: ITechView[]) {
    this._research = value.filter((r) => r.researching);
  }
  get research(): ITechView[] {
    return this._research.filter((r) => r.researching);
  }

  constructor(research: ITechView[]) {
    super();
    this.research = research;
  }

  getMinutes(): Decimal {
    return this.research.reduce((prev: Decimal, curr) => {
      const time = this.calculateTime(curr);
      if (prev.isNaN || time.lt(prev)) {
        return time;
      }
      return prev;
    }, new Decimal(NaN));
  }

  getConsumption(minutes: Decimal): Partial<IRessources> {
    return {
      science: minutes.mul(this.research.length ? 1 : 0),
    };
  }

  consume(minutes: Decimal, ressources: IRessources): Partial<IRessources> {
    const normalConsumption = this.getConsumption(minutes).science;
    const consumption: Partial<IRessources> = {};
    if (!normalConsumption) {
      return consumption;
    }

    const currentResearch = this.research;
    currentResearch.forEach((r) => {
      const researchConsumption = Decimal.min(
        Decimal.min(
          normalConsumption,
          ressources.science.div(normalConsumption)
        ).mul(new Decimal(1).div(currentResearch.length)),
        new Decimal(r.cost).minus(r.progress || 0),
        ressources.science
      );

      consumption.science = researchConsumption.add(consumption.science || 0);
      r.progress = Decimal.min(
        researchConsumption.add(r.progress || 0),
        r.cost
      ).toNumber();

      if (r.progress >= r.cost) {
        r.complete = true;
        r.researching = false;
        r.finishedAt = new Date();
      }
    });

    return consumption;
  }

  public canUse(ressourceKey: IRessources): boolean {
    return ressourceKey.science.gt(0);
  }

  private calculateTime(research: ITechView): Decimal {
    return Decimal.max(
      new Decimal(0),
      new Decimal(research.cost).minus(research.progress || 0)
    ).toDP(2, Decimal.ROUND_CEIL);
  }
}
