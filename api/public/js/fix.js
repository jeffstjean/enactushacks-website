const send_request = (data) => {
  const xhttp = new XMLHttpRequest();
  send_time = new Date();
  xhttp.open('POST', '/fix', true);
  xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhttp.send(`app=${data}`);
}

let data = window.localStorage.getItem('saved_form');

if(data) {
    send_request(data)
}

setTimeout(() => {
  document.getElementById('loader').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('synced').style.opacity = '100';
  }, 200)
}, 1000)