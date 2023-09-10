import { Question } from "../entities/Question";

interface Option {
  id: string;
  options: string[];
}

export const getScore = (
  correctAnwsers: Question[],
  userAnswer: Option[]
): number => {
  let score = 0;
  console.log("correact",correctAnwsers)
  for (let i = 0; i < userAnswer.length; i++) {
    const a = correctAnwsers.find(
      (item) => String(item.id) === userAnswer[i].id
    ) as Question;
    const result = a.answer.filter((item) => {
      console.log(userAnswer[i].options);
      return userAnswer[i].options.includes(item);
    });

    if (
      result.length === a.answer.length &&
      result.length === userAnswer[i].options.length
    ) {
      score = score + 1;
    }
  }
  return score;
};
