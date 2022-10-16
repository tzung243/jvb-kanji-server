'use strict';

const createHttpError = require('http-errors');
const { validateExamGenerateBodyYupSchema } = require('../../../utils/exam.validation');

/**
 * exam controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::exam.exam',({strapi})=> ({
    // API generate exam only authorization user
    async generate(ctx) {
        try {
            await validateExamGenerateBodyYupSchema(ctx.request.body);
        } catch (error) {
            throw createHttpError(400, "Cannot validate query params!");
        }

        const {
          body: { type, length, label, quickstart },
        } = ctx.request;

        ctx.send({
          data: await strapi.service("api::exam.exam").generate({
            type,
            length: length ?? 10,
            data: {
              user: ctx.state.user,
              data: {
                label,
                quickstart,
              },
            },
          }),
        });
    },

    async from(ctx) {
        try {
            await validateExamGenerateBodyYupSchema(ctx.request.body);
        } catch (error) {
            throw createHttpError(400, "Exam available id is required!");
        }
    }
}));
