"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScore = void 0;
const getScore = (correctAnwsers, userAnswer) => {
    let score = 0;
    console.log("correact", correctAnwsers);
    for (let i = 0; i < userAnswer.length; i++) {
        const a = correctAnwsers.find((item) => String(item.id) === userAnswer[i].id);
        const result = a.answer.filter((item) => {
            console.log(userAnswer[i].options);
            return userAnswer[i].options.includes(item);
        });
        if (result.length === a.answer.length &&
            result.length === userAnswer[i].options.length) {
            score = score + 1;
        }
    }
    return score;
};
exports.getScore = getScore;
//# sourceMappingURL=createScore.js.map