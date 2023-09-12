"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrayRandom = void 0;
const getArrayRandom = (array, quantity) => {
    const newArray = [];
    for (let i = 0; i < quantity; i++) {
        let rand = Math.floor(Math.random() * array.length);
        while (newArray.includes(rand)) {
            rand = Math.floor(Math.random() * array.length);
        }
        newArray.push(rand);
    }
    return newArray;
};
exports.getArrayRandom = getArrayRandom;
//# sourceMappingURL=getArrayRandom.js.map