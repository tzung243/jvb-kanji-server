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
  ],
};
