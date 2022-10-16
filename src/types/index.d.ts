declare enum EXAM_TYPES_ENUM {
  N2 = "N2",
  N3 = "N3",
  N4 = "N4",
  N5 = "N5",
}

declare enum ANSWER_LABEL_ENUM {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

declare type Question = {
  id: number;
  topic: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answerCorrect: ANSWER_LABEL_ENUM;
};