/**
 * 
 * @param {Array<number>} arr1 
 * @param {Array<number>} arr2 
 * @returns boolean
 */
const isArrayEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);  
};

/**
 * 
 * @param {Graph} nfa 
 * 
 * @returns {Graph}
 */
const nfaToDfa = (nfa) => {
    const nfaStates = [];
    const stack = [];
    const transitionTable = {};
    
    nfaStates.push(nfa.epsiClosure([nfa.startState]));
    
    stack.push(nfaStates[0]);

    let i = 0;
    while (stack.length > 0) {
        const currentState = stack.shift();

        if (!transitionTable[i]) {
            transitionTable[i] = {};
        }
        
        nfa.alphabets.forEach((alphabet) => {
            const state = nfa.epsiClosure(nfa.move(currentState, alphabet));

            // Check exist in stack
            let isExistInstack = false;
            
            stack.forEach((s) => {
                if (isArrayEqual(s, state)) {
                    isExistInstack = true;
                }
            });

            // Check exist in nfaStates
            let nfaStateExistIndex = -1;

            nfaStates.forEach((s, index) => {
                if (isArrayEqual(s, state)) {
                    nfaStateExistIndex = index;
                    transitionTable[i][alphabet] = index;
                }
            });

            if (nfaStateExistIndex == -1 && !isExistInstack) {
                stack.push(state);
                const index = nfaStates.push(state);
                transitionTable[i][alphabet] = index - 1;
            }
        });


        i++;
    }

    const startState = 'A';
    const acceptStates = [];
    nfaStates.forEach((state, index) => {
        state.forEach((s) => {
            if (nfa.acceptStates.includes(s)) {
                acceptStates.push(String.fromCharCode(65 + index));
            }
        });
    });

    const states = nfaStates.map((_, index) => String.fromCharCode(65 + index));
    const alphabets = nfa.alphabets;
    const transitions = [];

    for (let i = 0; i < nfaStates.length; i++) {
        for (let j = 0; j < nfa.alphabets.length; j++) {
            transitions.push({
                from: String.fromCharCode(65 + i),
                to: String.fromCharCode(65 + transitionTable[i][nfa.alphabets[j]]),
                input: nfa.alphabets[j]
            });
        }
    }

    return new Graph(startState, acceptStates, states, alphabets, transitions);
}