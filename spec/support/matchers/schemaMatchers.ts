import { Answerable, Expectation } from '@serenity-js/core';

const Joi = require('joi')

export const returnsCorrectSchema = (schema: Answerable<any>): Expectation<any> => {
    schema.toString = () => JSON.stringify(schema.describe())
    return Expectation.thatActualShould('does have the same json schema pattern as', schema)
    .soThat((actual: any, expected: any) => Joi.attempt(actual, expected))
    // .soThat((actual: any, expected: any) => Joi.assert(actual, expected))
}