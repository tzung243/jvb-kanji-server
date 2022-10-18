"use strict";

/**
 * exam router
 */

// const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::exam.exam');

module.exports = {
  routes: [
    {
      handler: "exam.generate",
      method: "POST",
      path: "/exam/generate",
    },
    {
      handler: "exam.start",
      path: "/exam/start",
      method: "POST",
    },
    {
      handler: "exam.getAll",
      path: "/exam/all",
      method: "GET",
    },
    {
      handler: "exam.submit",
      path: "/exam/submit",
      method: "POST",
    },
    {
      handler: "exam.selection",
      path: "/exam/selection/:examId/:questionId",
      method: "POST",
    },
    {
      handler: "exam.findOne",
      path: "/exam/:examId",
      method: "GET",
    },
    {
      handler: "exam.findQuestion",
      path: "/exam/:examId/:questionId",
      method: "GET",
    },
  ],
};
