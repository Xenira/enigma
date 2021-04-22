import Decimal from 'decimal.js';
import { IRessources } from 'enigma-common';

export abstract class Consumer {
	abstract getMinutes(): Decimal;
	abstract getConsumption(minutes: Decimal): Partial<IRessources>;
	abstract consume(
		minutes: Decimal,
		ressources: IRessources
	): Partial<IRessources>;
}
