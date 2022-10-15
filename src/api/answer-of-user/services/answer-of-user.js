'use strict';

/**
 * answer-of-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::answer-of-user.answer-of-user');
