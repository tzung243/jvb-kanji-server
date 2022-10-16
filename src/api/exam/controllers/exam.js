"use strict";

const createHttpError = require("http-errors");
const {
  validateExamGenerateBodyYupSchema,
} = require("../../../utils/exam.validation");
const {
  validateQueryPartitionYupSchema,
} = require("../../../utils/query.validation");

/**
 * exam controller
 */

const sanitizeExam = (exam) => {
  const userSchema = strapi.getModel("api::exam.exam");

  return sanitize.contentAPI.output(exam, userSchema);
};

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::exam.exam", ({ strapi }) => ({
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

  async start(ctx) {
    try {
      await validateExamGenerateBodyYupSchema(ctx.request.body);
    } catch (error) {
      throw createHttpError(400, "Exam Id is required!");
    }
    const { examId } = ctx.request.body;
    const exam = await strapi.entityService.findOne("api::exam.exam", examId);
    if (!exam) {
      throw createHttpError(404, "Can not found exam!");
    }
    if (exam.status !== "DRAFT") {
      throw createHttpError(
        400,
        `Exam is ${exam.status == "IN_PROGRESS" ? "started" : "completed"}!`
      );
    }
    const examAfterUpdate = await strapi.entityService.update(
      "api::exam.exam",
      examId,
      {
        data: {
          status: "IN_PROGRESS",
          startAt: Date.now(),
        },
      }
    );
    ctx.send({
      data: {
        id: examAfterUpdate.id,
      },
    });
  },

  async getAll(ctx) {
    try {
      await validateQueryPartitionYupSchema(ctx.request.query);
    } catch (error) {
      throw createHttpError(400, "Can not format query parameter!");
    }
    const { limit, page } = ctx.request.query;
    const _limit = limit ?? 10;
    const _page = page ?? 0;
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: {
        user: ctx.state.user.id,
      },
      sort: {
        startAt: "DESC",
        createAt: "DESC",
      },
      limit: _limit,
      start: _limit * _page,
    });
    ctx.send({
      data: exams.map((exam) => {
        return sanitizeExam(exam);
      }),
      limit: _limit,
      page: _page,
      start: _limit * _page,
    });
  },
}));
