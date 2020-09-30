const form = document.getElementById('apply')
const valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

form.onsubmit = (event) => {
    let data = new FormData(event.target)
    if(data.get('password').length < 8) {
        console.log('Password is too short')
        return false;
    }
    if(data.get('password') != data.get('password_verify')) {
        console.log('Passwords don\'t match')
        return false;
    }
    if(!valid_password.test(data.get('password'))) {
        console.log('Password must be at least 8 characters, have an uppercase, lowercase, number and one of the following characters: @, $, !, %, *, ?, &, #, ^')
        return false;
    }
    return true;
}