"use strict";

const createHttpError = require("http-errors");
const {
  validateExamGenerateBodyYupSchema,
  validateExamAnswerBodyYupSchema,
} = require("../../../utils/exam.validation");
const {
  validateExamSelectionParamYupSchema,
} = require("../../../utils/param.validation");
const {
  validateQueryPartitionYupSchema,
} = require("../../../utils/query.validation");

/**
 * exam controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::exam.exam", ({ strapi }) => ({
  async validateExam(exam) {
    if (exam.status === "IN_PROGRESS") {
    }
  },
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
    const exam = await strapi.service("api::exam.exam").handlerFindExamById({
      body: ctx.request.body,
    });
    if (exam.status !== "DRAFT") {
      throw createHttpError(
        400,
        `Exam is ${exam.status == "IN_PROGRESS" ? "started" : "completed"}!`
      );
    }
    const examAfterUpdate = await strapi.entityService.update(
      "api::exam.exam",
      exam.id,
      {
        data: {
          status: "IN_PROGRESS",
          startedAt: Date.now(),
        },
        populate: ["questions"],
      }
    );
    ctx.send({
      data: {
        id: examAfterUpdate.id,
      },
    });
  },

  async all(ctx) {
    const { limit, page } = ctx.request.query;
    const _limit = limit ?? 10;
    const _page = page ?? 0;
    const exams = await strapi.entityService.findMany("api::exam.exam", {
      filters: {
        user: {
          id: ctx.state.user.id,
        },
      },
      sort: {
        startedAt: "DESC",
        createdAt: "DESC",
      },
      populate: ["questions"],
      limit: _limit,
      start: _limit * _page,
    });
    ctx.send({
      data: exams,
      limit: _limit,
      page: _page,
      start: _limit * _page,
    });
  },

  async submit(ctx) {
    const exam = await strapi.service("api::exam.exam").handlerFindExamById({
      body: ctx.request.body,
      detail: true,
    });
    let answerCorrectQuantity = 0;
    for (let counter = 0; counter < exam.questions.length; counter++) {
      const answerOfUser = exam.questions[counter];
      if (answerOfUser.answer === answerOfUser.question.answerCorrect) {
        answerCorrectQuantity += 1;
      }
    }

    const examAfterUpdate = await strapi.entityService.update(
      "api::exam.exam",
      exam.id,
      {
        data: {
          score: Math.round(answerCorrectQuantity / exam.questions.length),
          status: "DONE",
          submittedAt: Date.now(),
        },
      }
    );
    ctx.send({
      data: {
        id: examAfterUpdate.id,
        score: examAfterUpdate.score,
      },
    });
  },

  async selection(ctx) {
    try {
      await validateExamSelectionParamYupSchema(ctx.params);
    } catch (error) {
      throw createHttpError(404, "Can not format param!");
    }
    try {
      await validateExamAnswerBodyYupSchema(ctx.body);
    } catch (error) {
      throw createHttpError(400, "Can not format answer in body!");
    }

    const { examId, questionId } = ctx.params;
    const { answer } = ctx.body;

    const exam = await strapi.entityService.findOne("api::exam.exam", examId);

    if (!exam) {
      throw createHttpError(404, "Can not found exam!");
    }
    if (exam.status === "IN_PROGRESS") {
      throw createHttpError(
        400,
        exam === "DRAFT" ? "Need run start!" : "Exam is completed!"
      );
    }
    const answerOfUser = await strapi.entityService.findOne(
      "api::answer-of-user.answer-of-user",
      questionId,
      {
        data: {
          answer,
        },
      }
    );
    ctx.send({
      data: answerOfUser,
    });
  },

  async exam(ctx) {
    const { examId } = ctx.params;
    const exam = await strapi.entityService.findOne("api::exam.exam", examId, {
      filters: {
        user: {
          id: ctx.state.user.id,
        },
      },
    });
    if (!exam) {
      throw createHttpError(404, "Can not found exam!");
    }

    let result = await strapi.entityService.findOne("api::exam.exam", examId, {
      filters: {
        user: {
          id: ctx.state.user.id,
        },
      },
      populate: ["questions", "questions.question"],
    });

    ctx.send({
      data: result,
    });
  },

  async question(ctx) {
    const { examId, questionId } = ctx.params;
    const exam = await strapi.entityService.findOne("api::exam.exam", examId, {
      populate: {
        questions: {
          filters: {
            id: questionId,
          },
          populate: {
            question: {
              fields: ["topic", "a", "b", "c", "d", "type"],
            },
          },
        },
      },
      filters: {
        user: {
          id: ctx.state.user.id,
        },
      },
    });
    ctx.send({
      data: exam?.questions[0],
    });
  },
}));
