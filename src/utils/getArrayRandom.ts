export const getArrayRandom = (array: any[], quantity: number) => {
  const newArray: number[] = [];
  for (let i = 0; i < quantity; i++) {
    let rand = Math.floor(Math.random() * array.length);
    while (newArray.includes(rand)) {
      rand = Math.floor(Math.random() * array.length);
    }
    newArray.push(rand);
  }
  return newArray;
};
