const S = require('fluent-json-schema')
const {
    usernamePassObj,
    registrationObj,
    userObject,
    responseObject
} = require('../../../config/schema')

/**
 * * POST /v1/auth/login
 */
const loginSchema = {
    body: usernamePassObj,
    response: { 200: responseObject() }
}
/**
 * * POST /v1/auth/register
 */
const registerSchema = {
    body: registrationObj,
    response: { 201: responseObject() }
}
/**
 * * GET /v1/auth/me
 */
const meSchema = {
    response: {
        200: responseObject(userObject)
    }
}

/**
 * * GET /v1/auth/me
 */
const requestOTPSchema = {
    body: S.object().prop(
        'email',
        S.string().minLength(6).maxLength(100).format('email').required()
    ),
    response: {
        200: responseObject()
    }
}
/**
 * * POST /v1/auth/verify-email
 */
const verifyEmailSchema = {
    body: S.object().prop(
        'code',
        S.string().minLength(5).maxLength(6).required()
    ),
    response: { 201: responseObject(S.object().prop('token', S.string())) }
}
/**
 * * POST /v1/auth/reset-password
 */
const resetPassBody = S.object()
    .prop(
        'email',
        S.string().minLength(6).maxLength(100).format('email').required()
    )
    .prop('password', S.string().required())
    .prop('code', S.string().minLength(5).maxLength(6).required())

const resetPasswordSchema = {
    body: resetPassBody,
    response: { 201: responseObject(S.object().prop('token', S.string())) }
}

module.exports = {
    loginSchema,
    registerSchema,
    meSchema,
    requestOTPSchema,
    verifyEmailSchema,
    resetPasswordSchema
}
