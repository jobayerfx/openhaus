/**
 * * Fetch User by Email
 */
const fetchUser = async (app, id) => {
    const user = await app.knex('user_customers').where('id', id).first()

    if (!user) throw app.httpErrors.notFound('User not found!')

    return user
}
/**
 * * Authenticate passed user
 */
const authenticate = async (app, props) => {
    const { username, password } = props || {}
    const key = `uniq:timeout:${username}`
    let count = await app.cache.get(key)
    if (count >= 5) {
        throw app.httpErrors.forbidden(
            '5 Wrong Attempts! Try again in 5 minutes.'
        )
    }

    const user = await app.knex('user_customers').where('username', username).first()

    if (!user) throw app.httpErrors.notFound(`User: ${username}, not found!`)

    const match = await app.bcrypt.compare(password, user.password)

    if (!match) {
        count++
        await app.redis.setex(key, 300, count.toString())
        throw app.httpErrors.forbidden('Password Incorrect!')
    }

    return await app.auth.token(user)
}
/**
 * * Create User via Registration
 */
const registration = async (app, props) => {
    let { username, email, password } = props || {}

    let user = await app.knex('user_customers').where('email', email).orWhere('username', username).first()

    if (user)
        throw app.httpErrors.badRequest(
            `User: ${username} already exists! Please Login`
        )

    password = await app.bcrypt.hash(password)

    const userID = await app.knex('user_customers').insert({ username, username, email, password })

    user = {
        id: userID[0],
        email,
        email_verified: false,
        is_banned: false
    }
    return await app.auth.token(user)
}

const verifyUserEmail = async (app, email) => {
    const isUpdated = await app
        .knex('user_customers')
        .where('email', email)
        .update({ email_verified: true })

    if (!isUpdated) throw app.httpErrors.notFound(`User: ${email}, not found!`)

    const user = await app.knex('user_customers').where('email', email).first()
    return await app.auth.token({ ...user, role: 'customer' })
}

const updateUserPassword = async (app, props) => {
    const { email, password } = props || {}

    const hashedPassword = await app.bcrypt.hash(password)

    const isUpdated = await app
        .knex('user_customers')
        .where('email', email)
        .update({ password: hashedPassword })

    if (!isUpdated) throw app.httpErrors.notFound(`User: ${email}, not found!`)
}

/**
 * * Generate OTP Code
 */
const getOTP = async (app, email) => {
    const user = await app.knex('user_customers').where('email', email).first()

    if (!user) throw app.httpErrors.notFound('User not found!')

    const otp_code = Math.random().toString().substring(2, 8)

    //* 30 minute expiry
    await app.redis.setex(`uniq:otp:${email}`, 1800, otp_code)

    app.log.info({ otp_code }, 'otp here: ')

    app.queue.add(`${'otp'}-${email}`, {
        action: 'otp',
        payload: {
            email,
            otp_code
        }
    })

    return otp_code
}
/**
 * * Verify OTP Code
 */
const verifyOTP = async (app, props) => {
    const key = `uniq:otp:${props.email}`

    const otp = await app.redis.get(key)

    // eslint-disable-next-line eqeqeq
    if (otp && otp == props.code) {
        await app.redis.del(key)
        return true
    } else {
        return false
    }
}

module.exports = {
    registration,
    authenticate,
    fetchUser,
    getOTP,
    verifyOTP,
    verifyUserEmail,
    updateUserPassword
}
