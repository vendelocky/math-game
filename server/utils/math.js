/* Server-side Math Generator */

const MODES = {
    ADD: 'add',
    SUB: 'sub',
    MUL: 'mul',
    DIV: 'div',
    ALL: 'all',
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateExpression = (mode, difficulty) => {
    let a, b, val, operator;

    let op = mode;
    if (op === MODES.ALL) {
        const ops = [MODES.ADD, MODES.SUB, MODES.MUL, MODES.DIV];
        op = ops[getRandomInt(0, 3)];
    }

    const range = difficulty * 10;

    switch (op) {
        case MODES.ADD:
            val = getRandomInt(2, range);
            b = getRandomInt(1, val - 1);
            a = val - b;
            operator = '+';
            break;
        case MODES.SUB:
            b = getRandomInt(1, Math.max(5, range / 2));
            val = getRandomInt(0, range);
            a = val + b;
            operator = '-';
            break;
        case MODES.MUL:
            const maxFactor = Math.min(12, 2 + difficulty * 2);
            a = getRandomInt(1, maxFactor);
            b = getRandomInt(1, maxFactor);
            val = a * b;
            operator = '×';
            break;
        case MODES.DIV:
            val = getRandomInt(1, Math.min(10 + difficulty, 20));
            b = getRandomInt(1, Math.min(5 + difficulty, 10));
            a = val * b;
            operator = '÷';
            break;
        default:
            val = 0; a = 0; b = 0; operator = '?';
    }

    return {
        a, b, operator, val,
        text: `${a} ${operator} ${b}`,
        id: Math.random().toString(36).substr(2, 9)
    };
};

const generateRound = (mode, difficulty = 1) => {
    let options = [];
    let attempts = 0;

    while (attempts < 100) {
        options = [];
        while (options.length < 4) {
            options.push(generateExpression(mode, difficulty));
        }
        const sorted = [...options].sort((x, y) => y.val - x.val);
        if (sorted[0].val > sorted[1].val) {
            return {
                options,
                winnerId: sorted[0].id
            };
        }
        attempts++;
    }
    options[0].val += 100; // Fallback
    return { options, winnerId: options[0].id };
};

module.exports = { generateRound, MODES };
