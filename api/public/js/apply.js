const form = document.getElementById('apply')
const valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

form.onsubmit = (event) => {
    let data = {}
    document.querySelectorAll('#apply input, #apply select').forEach(element => {
        if(element.type != 'submit') data[element.name] = element.value
    })
    if(data.password.length < 8) {
        console.log('Passwords is too short')
        return false;
    }
    if(data.password != data.password_verify) {
        console.log('Passwords don\'t match')
        return false;
    }
    if(!valid_password.test(data.password)) {
        console.log('Password must be at least 8 characters, have an uppercase, lowercase, number and special character')
        return false;
    }
    if(data.gender.toLowerCase() === 'choose') {
        console.log('Must specify a gender')
        return false;
    }
    delete data.password_verify;
    return true;
}