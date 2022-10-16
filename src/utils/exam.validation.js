const { yup, validateYupSchema } = require("@strapi/utils");
const { ANSWER_LABEL_ENUM } = require("../enum/answer.enum");
const { EXAM_TYPES_ENUM } = require("../enum/exam-types.enum");

const examGenerateBodyYupSchema = yup.object({
  type: yup
    .mixed()
    .oneOf([
      EXAM_TYPES_ENUM.N2,
      EXAM_TYPES_ENUM.N3,
      EXAM_TYPES_ENUM.N4,
      EXAM_TYPES_ENUM.N5,
    ])
    .required(),
  length: yup.number(),
  label: yup.string().min(5),
});

const examFromExamAvailableBodyYubSchema = yup.object({
  examAvailableId: yup.number().required(),
});

const handlerFindExamByIdBodyYupSchema = yup.object({
    examId: yup.number().required(),
  });

const examStartBodyYubSchema = handlerFindExamByIdBodyYupSchema;

const examSubmitBodyYupSchema = examStartBodyYubSchema;


const examAnswerBodyYupSchema = yup.object({
  answer: yup
    .mixed()
    .oneOf([
      ANSWER_LABEL_ENUM.A,
      ANSWER_LABEL_ENUM.B,
      ANSWER_LABEL_ENUM.C,
      ANSWER_LABEL_ENUM.D,
    ]),
});

module.exports = {
  validateExamGenerateBodyYupSchema: validateYupSchema(
    examGenerateBodyYupSchema
  ),
  validateExamFromExamAvailableBodyYubSchema: validateYupSchema(
    examFromExamAvailableBodyYubSchema
  ),
  validateExamStartBodyYubSchema: validateYupSchema(examStartBodyYubSchema),
  validateExamSubmitBodyYupSchema: validateYupSchema(examSubmitBodyYupSchema),
  validateHandlerFindExamByIdBodyYupSchema: validateYupSchema(
    handlerFindExamByIdBodyYupSchema
  ),
  validateExamAnswerBodyYupSchema: validateYupSchema(examAnswerBodyYupSchema),
};
