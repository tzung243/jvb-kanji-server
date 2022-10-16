'use strict';

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
  ],
};
