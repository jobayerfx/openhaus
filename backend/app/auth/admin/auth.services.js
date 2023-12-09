/**
 * * Fetch User by Email
 */
const fetchAdmin = async (app, email) => {
    const user = await app
        .knex('user_admins')
        .where('user_admins.email', email)
        .leftJoin('user_roles', 'user_admins.role_id', '=', 'user_roles.id')
        .first()

    if (!user) throw app.httpErrors.notFound(`User: ${email}, not found!`)

    return user
}
/**
 * * Authenticate passed user
 */
const authenticate = async (app, props) => {
    const { email, password } = props || {}
    const key = `uniq:timeout:${email}`
    let count = await app.cache.get(key)
    if (count >= 5) {
        throw app.httpErrors.forbidden(
            '5 Wrong Attempts! Try again in 10 minutes.'
        )
    }

    const user = await fetchAdmin(app, email)

    const match = await app.bcrypt.compare(password, user.password)

    if (!match) {
        count++
        await app.redis.setex(key, 600, count.toString())
        throw app.httpErrors.forbidden('Password Incorrect!')
    }

    return await app.auth.token(user)
}
/**
 * * Create User via createAdmin
 */
const createAdmin = async (app, props) => {
    const { email, password, role_id } = props || {}

    const user = await app.knex('user_admins').where('email', email).first()

    if (user)
        throw app.httpErrors.badRequest(
            `User: ${email} already exists! Please Login`
        )

    const hash = await app.bcrypt.hash(password)

    return await app
        .knex('user_admins')
        .insert({ email, password: hash, role_id })
}

const updateAdmin = async (app, props) => {
    let { email, password, role_id } = props || {}

    if (password) {
        password = await app.bcrypt.hash(password)
    }

    const isUpdated = await app
        .knex('user_admins')
        .where('email', email)
        .update({ email, password, role_id })

    if (!isUpdated) throw app.httpErrors.notFound(`User: ${email}, not found!`)
}

module.exports = {
    createAdmin,
    updateAdmin,
    fetchAdmin,
    authenticate
}
