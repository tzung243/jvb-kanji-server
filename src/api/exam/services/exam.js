"use strict";

const createHttpError = require("http-errors");

/**
 * exam service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::exam.exam", ({ strapi }) => ({
  /**
   *
   * @param {{type: EXAM_TYPES_ENUM, length: number}} param0
   */
  async generate({
    type,
    length,
    data: {
      user,
      data: { label },
    },
  }) {
    /**
     * @type {Question[]}
     */
    const questions = await strapi.entityService.findMany(
      "api::question.question",
      {
        data: {
          type,
        },
      }
    );
    const questionIds = await this.selectionQuestion({ questions, length });
    return this.make({
      questionIds,
      user,
      data: {
        label,
      },
    });
  },

  /**
   *
   * @param {{questionIds: number[]}} param
   */
  async make({ questionIds, user, data: { label } }) {
    console.log(questionIds);
    const answerOfUserIds = []
    for (let counter = 0; counter < questionIds.length; counter += 1) {
      const answerOfUser = await strapi.entityService.create(
        "api::answer-of-user.answer-of-user",
        {
          data: {
            question: questionIds[counter],
            answer: "NONE",
          },
        }
      );
      answerOfUserIds.push(answerOfUser.id);
    }
    const exam = await strapi.entityService.create("api::exam.exam", {
      data: {
        questions: answerOfUserIds,
        user: user.id,
        label: label,
      },
    });
    return {
      id: exam.id,
      label,
    };
  },

  /**
   * @return {number[]} list question ids random
   * @param {{questions: Question[], length: number}} param
   */
  async selectionQuestion({ questions, length }) {
    if (questions.length < length)
      // TODO: Message response throw error
      throw createHttpError(400, "Data of question is insufficient!");
    let questionIds = questions.map((question) => question.id);
    if (questions.length === length) return questionIds;
    const result = [];
    for (let counter = 0; counter < length; counter += 1) {
      const questionId = questionIds[Math.round(Math.random() * length)];
      questionIds = questionIds.filter(
        (questionId) => !result.includes(questionId)
      );
      result.push(questionId);
    }
    return result;
  },
}));
