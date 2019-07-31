const isPasswordLongEnough = (password) => {
  return password.length >= 8;
};

const isPasswordTooLong = (password) => {
  return password.length < 100;
};

const checkEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isNotEmpty = (string) => {
  var re = /\S/;
  return string !== null && string !== "" && re.test(myString);
}

const isEmailValid = [
  { validator: checkEmail, msg: 'Please enter a valid email' }
];

const isPasswordValid = [
  { validator: isPasswordLongEnough, msg: 'Password must have a length of at least 8' },
  { validator: isPasswordTooLong, msg: 'Password must have a length of less than 100' }
];

const deleteEmpty = (v) => {
   if(v==null){
     return undefined;
   }
   return v;
}

module.exports = {
  isEmailValid,
  isPasswordValid,
  deleteEmpty
}
