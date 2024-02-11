class Graph {
	/**
	 * 
	 * @param {string} startState 
	 * @param {Array<string>} acceptStates 
	 * @param {Array<string>} states 
	 * @param {Array<string>} alphabets 
	 * @param {Array<{ from: string, to: string, input: string }>} transitions 
	 */
	constructor(startState, acceptStates, states, alphabets, transitions) {
		this.startState = startState;
		this.acceptStates = acceptStates;
		this.states = states;
		this.alphabets = alphabets;
		// change the format of transitions
		this.transitions = transitions.reduce((acc, { from, to, input }) => {
			if (!acc[from]) {
				acc[from] = {};
			}
			if (!acc[from][input]) {
				acc[from][input] = [];
			}
			acc[from][input].push(to);
			return acc;
		}, {});
	}

	/**
	 * @param {Array<string>} start
	 * 
	 * @returns {Array<string>}
	 */
	epsiClosure(start) {
		const visited = {};
		const stack = [...start];
		while (stack.length) {
			const current = stack.pop();
			if (visited[current]) {
				continue;
			}
			visited[current] = true;
			if (this.transitions[current] && this.transitions[current].eps) {
				stack.push(...this.transitions[current].eps);
			}
		}
		return Object.keys(visited);
	}

	/**
	 * @param {Array<string>} states
	 * @param {string} input
	 * 
	 * @returns {Array<string>}
	 */
	move(states, input) {
		return states.reduce((acc, state) => {
			if (this.transitions[state] && this.transitions[state][input]) {
				acc.push(...this.transitions[state][input]);
			}
			return acc;
		}, []);
	}

	/**
	 * @param {Array<string>} states
	 * @param {string} input
	 * 
	 * @returns {Array<string>}
	 */
	dTran(states, input) {
		const result = states.reduce((acc, state) => {
			acc.push(...this.move(this.epsiClosure(state), input));
			return acc;
		}, []);
		return this.epsiClosure(result.join(''));
	}
}

// module.exports = Graph;