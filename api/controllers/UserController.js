const User = require('../models/UserModel')

const trim_object_strings = (obj) => {
    Object.keys(obj).map(k => obj[k] = typeof obj[k] == 'string' ? obj[k].trim() : obj[k])
    return obj;
}

const delete_empty_strings = (obj) => {
    Object.keys(obj).forEach(k => { if(obj[k] === '') delete obj[k] });
    return obj;
}

const lower_case_strings = (obj, ignore=[]) => {
    Object.keys(obj).map(k => obj[k] = (ignore.indexOf(k) === -1 && typeof obj[k] == 'string') ? obj[k].toLowerCase() : obj[k] )
    return obj;
}

const create_user = async(user_data) => {
    user_data = trim_object_strings(user_data)
    user_data = delete_empty_strings(user_data)
    user_data = lower_case_strings(user_data, ['first_name', 'last_name', 'password'])
    try {
        const user = await new User(user_data).save()
        return { user, err: null }
    }
    catch(err) {
        return { user: null, err }
    }

}

const get_user = async(_id) => {
    try {
        const user = await User.findById(_id)
        return (user) ? { user, err: null } : { user: null, err: 'NoUser' }
    }
    catch(err) {
        return { user: null, err }
    }

}

const get_user_by_email = async(email) => {
    try {
        const user = await User.findOne({ email: email })
        if(user) {
            return { user, err: null }
        }
        else {
            return { user: null, err: 'NoUser' }
        }
    }
    catch(err) {
        return { user: null, err }
    }

}

const get_user_by_token = async(token) => {
    try {
        const user = await User.findOne({ token: token })
        return (user) ? { user, err: null } : { user: null, err: 'NoUser' }
    }
    catch(err) {
        return { user: null, err }
    }

}

module.exports = {
    create_user,
    get_user,
    get_user_by_email,
    get_user_by_token
}