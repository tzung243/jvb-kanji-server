
const { yup, validateYupSchema } = require("@strapi/utils");
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

module.exports = {
  validateExamGenerateBodyYupSchema: validateYupSchema(
    examGenerateBodyYupSchema
  ),
  validateExamFromExamAvailableBodyYubSchema: validateYupSchema(
    examFromExamAvailableBodyYubSchema
  ),
};