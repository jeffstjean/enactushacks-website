/*
* Code from https://codepen.io/soulwire/pen/mErPAK
* All credit goes to Justin Windle (https://soulwire.co.uk/)
*/

class TextScramble {
    constructor(el) {
      this.el = el
      this.chars = '!<>-_\\/[]{}—=+*^?#________'
      this.update = this.update.bind(this)
    }
    setText(newText) {
      const oldText = this.el.innerText
      const length = Math.max(oldText.length, newText.length)
      const promise = new Promise((resolve) => this.resolve = resolve)
      this.queue = []
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ''
        const to = newText[i] || ''
        const start = Math.floor(Math.random() * 20)
        const end = start + Math.floor(Math.random() * 20)
        this.queue.push({ from, to, start, end })
      }
      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
      return promise
    }
    update() {
      let output = ''
      let complete = 0
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i]
        if (this.frame >= end) {
          complete++
          output += to
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar()
            this.queue[i].char = char
          }
          output += `<span class="dud">${char}</span>`
        } else {
          output += from
        }
      }
      this.el.innerHTML = output
      if (complete === this.queue.length) {
        this.resolve()
      } else {
        this.frameRequest = requestAnimationFrame(this.update)
        this.frame++
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
  }
  
const phrases = ['24 Hours.', 'Huge Prizes.', 'Infinite Ideas.'];

const el = document.getElementById('random-title');
const fx = new TextScramble(el)

let counter = 0
const next = () => {
fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 3000)
})
counter = (counter + 1) % phrases.length
}

setTimeout(next, 300)

const loading = (element) => {
  element.classList.add('loading');
  element.classList.remove('normal');
  element.value = 'PROCESSING...'
}

const success = (element) => {
  element.classList.remove('loading');
  element.classList.add('complete');
  element.value = 'SUCCESS!'
}

const error = (element) => {
  element.classList.remove('complete');
  element.classList.remove('loading');
  element.classList.remove('normal');
  element.classList.add('error');
}

const add_email = async (event) => {
  const mailing_list = 'eh1'
  const params = `email=${event.email.value}&list=${mailing_list}`
  const url = '/mail'
  const loading_time = 2000;

  document.activeElement.blur();
  event.childNodes[1].disabled = true;
  loading(event.childNodes[1]);

  const start_time = Date.now();
  const http = new XMLHttpRequest();
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {
    if(http.readyState === XMLHttpRequest.DONE) {
      if(http.status >= 200 && http.status < 400)  {
        // play the animation for the reamining loading time or immediately
        delta_time = Date.now() - start_time;
        if(loading_time - delta_time > 0) {
          setTimeout(() => {
            success(event.childNodes[1])
          }, loading_time - delta_time)
        }
        else {
          success(event.childNodes[1]);
        }
      }
      else {
        // play the animation for the reamining loading time or immediately
        delta_time = Date.now() - start_time;
        if(loading_time - delta_time > 0) {
          setTimeout(() => {
            error(event.childNodes[1])
            event.childNodes[1].value = 'ERROR - TRY AGAIN LATER'
          }, loading_time - delta_time)
        }
        else {
          error(event.childNodes[1]);
          event.childNodes[1].value = 'ERROR - TRY AGAIN LATER'
        }
      }
    }
  }

  http.send(params);
}