module.exports = {
    name: 'session',
    secret: process.env.COOKIE_KEY ? process.env.COOKIE_KEY : 'abc',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production'
}