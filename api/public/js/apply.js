const shipping_check = document.getElementById('is_shipping');
const shipping_div = document.getElementById('shipping_div');
const form = document.getElementById('apply');

let last_form_change = new Date();
const SAVE_DELTA = 100;

const handle_checkbox = (event) => {
    const checked = shipping_check.checked;
    if(checked) shipping_div.style.display = "block";
    else shipping_div.style.display = "none";

    if(!event) return; // don't continue on first invoke
    shipping_div.childNodes.forEach(child => {
        if(child.nodeName === 'INPUT' && child.name !== 'ship_apartment') {
            child.setAttribute('required', checked)
        }
    })
}
handle_checkbox();

shipping_check.addEventListener('change', handle_checkbox);

const handle_form_save = (event) => {
    if(new Date() - last_form_change >= SAVE_DELTA || true) {
        const form_data = new FormData(form)
        let save = {}
        for (const [key, value] of form_data.entries()) {
            save[key] = value
        }
        window.localStorage.setItem('saved_form', JSON.stringify(save))
    }
}

form.addEventListener('change', handle_form_save);

const load_form_data = () => {
    const saved_form = window.localStorage.getItem('saved_form');
    if(saved_form) {
        console.log('Loading previous form')
        try {
            const form_data = JSON.parse(saved_form)
            for(const [key, value] of Object.entries(form_data)) {
                document.getElementById(key).value = value
            }
        }
        catch(e) {
            console.log('unable to reload data')
            console.log(e)
            window.localStorage.removeItem('saved_form')
        }
    }
}

load_form_data();