// import * as _ from 'lodash';

import { resolveBattle } from './battle';
import { unitTypes } from '../modules/board';

describe('#resolveBattle', () => {
	test('In case of same unit type, larger army always wins', async () => {
		// Test each unit type
		Object.values(unitTypes).forEach(unitType => {
			const attacker = { unitCount: 20, unitType };
			const defender = { unitCount: 10, unitType };
			const result = resolveBattle(attacker, defender);
			expect(result.attacker).toBeGreaterThan(0);
			expect(result.defender).toBe(0);
		});
	});
	
	test('In case of same unit count, and -type, should result in a tie', async () => {
		// Test each unit type
		Object.values(unitTypes).forEach(unitType => {
			const attacker = { unitCount: 10, unitType };
			const defender = { unitCount: 10, unitType };
			const result = resolveBattle(attacker, defender);
			expect(result.attacker).toBe(0);
			expect(result.defender).toBe(0);
		});
	});
	
	test('In case of same unit count, the favored unit type should win', async () => {
		// [attacker, defender] pairs, where attacker is always favored
		[
			[unitTypes.RIFLE, unitTypes.ROCKET],
			[unitTypes.TANK, unitTypes.RIFLE],
			[unitTypes.ROCKET, unitTypes.TANK],
		].forEach(([attackerType, defenderType]) => {
			const attacker = { unitCount: 10, unitType: attackerType };
			const defender = { unitCount: 10, unitType: defenderType };
			const result = resolveBattle(attacker, defender);
			expect(result.attacker).toBeGreaterThan(0);
			expect(result.defender).toBe(0);
		});
	});
});