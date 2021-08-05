import { equals } from '@serenity-js/assertions';

const statusCodes = require('http-status-codes').StatusCodes

export const hasCreatedStatus = equals(statusCodes.CREATED);

export const hasSuccessfullStatus = equals(statusCodes.OK);

export const hasNoContentStatus = equals(statusCodes.NO_CONTENT);

export const wasNotAuthorizedStatus = equals(statusCodes.UNAUTHORIZED)

export const wasABadRequestStatus = equals(statusCodes.BAD_REQUEST);

export const wasForbiddenStatus = equals(statusCodes.FORBIDDEN)

export const wasNotfoundStatus = equals(statusCodes.NOT_FOUND);

export const wasAServerErrorStatus = equals(statusCodes.INTERNAL_SERVER_ERROR);
