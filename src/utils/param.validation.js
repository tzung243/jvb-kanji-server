const { yup, validateYupSchema } = require('@strapi/utils')

const examSelectionParamYupSchema = yup.object({
  examId: yup.string().required(),
  questionId: yup.string().required(),
});

module.exports = {
  validateExamSelectionParamYupSchema: validateYupSchema(
    examSelectionParamYupSchema
  ),
};