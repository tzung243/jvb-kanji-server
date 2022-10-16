const { yup, validateYupSchema } = require("@strapi/utils");

const queryPartitionYupSchema = yup.object({
  limit: yup.number().min(0),
  page: yup.number().min(0),
});

module.exports = {
  validateQueryPartitionYupSchema: validateYupSchema(queryPartitionYupSchema),
};