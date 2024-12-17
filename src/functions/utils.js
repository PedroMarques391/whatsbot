/* eslint-disable indent */
require('dotenv').config();

const groupIdsAllowed = process.env.ALLOWED_GROUPS
    ? process.env.ALLOWED_GROUPS.split(',')
    : [];

module.exports = { groupIdsAllowed };
