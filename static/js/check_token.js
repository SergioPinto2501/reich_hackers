document.getElementById('button-token').addEventListener('click', function() {
    div = document.getElementById('message-for-player');
    div.innerHTML = '';
    h2 = document.createElement('h2');
    h2.innerHTML = "Controllo Token";

    //<button onclick="closeInfoNodo()" id="close-info" style="position: absolute; top: 5px; right: 5px;">X</button>
    buttonClose = document.createElement('button');
    buttonClose.innerHTML = 'X';
    buttonClose.id = 'close-info';
    buttonClose.style.position = 'absolute';
    buttonClose.style.top = '5px';
    buttonClose.style.right = '5px';
    buttonClose.onclick = closeCheckToken;
    div.appendChild(buttonClose);

    p = document.createElement('p');
    p.innerHTML = "Inserisci il token per portare a termine l'attacco";

    form = document.createElement('form');
    form.method = 'POST';
    form.action = '/check_token';
    input = document.createElement('input');
    input.type = 'text';
    input.name = 'token';
    input.required = true;
    input.placeholder = 'Inserisci il token';
    divInput = document.createElement('div');
    divInput.className = 'form-group';
    divInput.appendChild(input);
    form.appendChild(divInput);


    button = document.createElement('button');
    button.type = 'submit';
    button.innerHTML = 'Invia';
    button.className = 'btn btn-primary';
    divInput.appendChild(button);


    div.appendChild(h2);
    div.appendChild(p);

    form.appendChild(divInput);
    div.appendChild(form);


    div.style.display = 'block';
});

function closeCheckToken() {
    div = document.getElementById('message-for-player');
    div.style.display = 'none';
    div.innerHTML = '';
}