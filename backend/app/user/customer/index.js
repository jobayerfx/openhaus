const bcrypt = require('../../../plugins/bcrypt')

const {
    showAll,
    show,
    update,
    destroy,
    filter
} = require('./customer.handlers')
const {
    s_showAll,
    s_show,
    s_update,
    s_destroy,
    s_filter
} = require('./customer.schemas')

module.exports = async function (fastify) {
    fastify.register(bcrypt)

    fastify.route({
        method: 'GET',
        url: '/',
        onRequest: fastify.role.restricted,
        schema: s_showAll,
        handler: showAll
    })

    fastify.route({
        method: 'GET',
        url: '/filter',
        onRequest: fastify.role.restricted,
        schema: s_filter,
        handler: filter
    })

    fastify.route({
        method: 'GET',
        url: '/:id',
        onRequest: fastify.role.restricted,
        schema: s_show,
        handler: show
    })

    fastify.route({
        method: 'PATCH',
        url: '/:id',
        onRequest: fastify.role.restricted,
        schema: s_update,
        handler: update
    })

    fastify.route({
        method: 'DELETE',
        url: '/:id',
        onRequest: fastify.role.admin,
        schema: s_destroy,
        handler: destroy
    })
}
