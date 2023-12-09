/**
 * * email verified middleware.
 * * for ordering and profile operations
 */
const verified = async (request, reply) => {
	await request.jwtVerify()
	if (request.user.email_verified === false) {
		reply.code(403)
		throw Error(`User: ${request.user.email} is not verified`)
	}
}
/**
 * * check if logged in
 */
const authenticated = async (request, reply) => {
	await request.jwtVerify()
	if (request.user.is_banned) {
		reply.code(403)
		throw Error(`${request.user.email} is banned.`)
	}
}
/**
 * *  admin role check
 */
const admin = async (request, reply) => {
	await request.jwtVerify()
	if (request.user.role !== 'admin') {
		reply.code(401)
		throw Error(`${request.user.email} does not have permission`)
	}
}
/**
 * * manager role check
 */
const manager = async (request, reply) => {
	await request.jwtVerify()
	if (request.user.role !== 'manager') {
		reply.code(401)
		throw Error(`${request.user.email} does not have permission`)
	}
}
/**
 * * Blocks Customer
 * * Allows User with admin or manager role
 */
const restricted = async (request, reply) => {
	await request.jwtVerify()
	const roles = ['admin', 'manager']
	const allowed = roles.includes(request.user.role)
	if (!allowed) {
		reply.code(401)
		throw Error(`${request.user.email} does not have permission`)
	}
}

module.exports = { authenticated, verified, admin, manager, restricted }
