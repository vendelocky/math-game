export const MODES = {
    ADD: 'add',
    SUB: 'sub',
    MUL: 'mul',
    DIV: 'div',
    ALL: 'all',
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateExpression = (mode) => {
    let a, b, val, operator;

    // Decide actual operator (handle all)
    let op = mode;
    if (op === MODES.ALL) {
        const ops = [MODES.ADD, MODES.SUB, MODES.MUL, MODES.DIV];
        op = ops[getRandomInt(0, 3)];
    }

    // "Every number must be 1 digit only" (1-9)
    // "Not limited to 10" (Results can go higher naturally)

    switch (op) {
        case MODES.ADD:
            a = getRandomInt(1, 9);
            b = getRandomInt(1, 9);
            val = a + b;
            operator = '+';
            break;

        case MODES.SUB:
            a = getRandomInt(1, 9);
            b = getRandomInt(1, 9);
            // Ensure positive result (a >= b) could be one way, 
            // OR ensure displayed numbers are single digits. 
            // If a and b are single digits, the only constraint is usually non-negative for kids.
            if (b > a) {
                const temp = a;
                a = b;
                b = temp;
            }
            val = a - b;
            operator = '-';
            break;

        case MODES.MUL:
            a = getRandomInt(1, 9);
            b = getRandomInt(1, 9);
            val = a * b;
            operator = '×';
            break;

        case MODES.DIV:
            // a and b must be single digits (1-9).
            // a must be divisible by b.
            // We pick b (divisor) and val (quotient/result) such that a (dividend) is <= 9.
            b = getRandomInt(1, 9);
            // a = val * b. We need a <= 9.
            // val * b <= 9  =>  val <= 9 / b.
            const maxVal = Math.floor(9 / b);
            val = getRandomInt(1, maxVal);
            a = val * b;
            operator = '÷';
            break;

        default:
            val = 0; a = 0; b = 0; operator = '?';
    }

    return {
        a,
        b,
        operator,
        val,
        text: `${a} ${operator} ${b}`,
        id: Math.random().toString(36).slice(2, 11)
    };
};

export const generateRound = (mode) => {
    let options = [];
    let attempts = 0;

    while (attempts < 1000) {
        options = [];
        // const values = new Set();

        // Generate 4 unique-ish options
        while (options.length < 4) {
            const expr = generateExpression(mode);
            // Try to avoid exact duplicate values for better gameplay variety, 
            // but strict uniqueness isn't required by rules, just "Which is bigger".
            // However, duplicate MAX values breaks the game logic.
            options.push(expr);
        }

        // Check if unique winner
        const sorted = [...options].sort((x, y) => y.val - x.val);

        const maxVal = sorted[0].val;
        const secondMax = sorted[1].val;

        if (maxVal > secondMax) {
            return {
                options,
                winnerId: sorted[0].id
            };
        }
        attempts++;
    }

    // Fallback (force a winner if loop fails)
    options[0].val += 100;
    options[0].text = "999 + 1"; // Debug fallback
    return { options, winnerId: options[0].id };
};
