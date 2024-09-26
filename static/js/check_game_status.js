
function check_game_status() {
    console.log('check_game_status');
    console.log(intervalIdStatus);
     fetch('/get_game_status/')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'end') {
            stop_check_game_status();
            div = document.getElementById('message-for-player');
            div.innerHTML = '';
            h2 = document.createElement('h2');
            h2.innerHTML = 'Game Over';
            div.appendChild(h2);
            p = document.createElement('p');
            p.innerHTML = 'La tua rete è stata compromessa! <br>La Guerra è terminata. Ha vinto <strong>' + data.winner + '</strong>.';
            div.appendChild(p)
            button = document.createElement('button');
            button.innerHTML = 'Torna alla Home';

            button.onclick = function() {
                window.location.href = '/';
            }
            div.appendChild(button);
            div.style.display = 'block';

        }
        if(data.status === 'abandoned'){
            winner = data.winner;
            stop_check_game_status();
            div = document.getElementById('message-for-player');
            div.innerHTML = '';
            h2 = document.createElement('h2');
            h2.innerHTML = 'Hai vinto!';
            div.appendChild(h2);
            p = document.createElement('p');
            p.innerHTML = 'Il tuo avversario ha abbandonato la partita.';
            div.appendChild(p)
            button = document.createElement('button');
            button.innerHTML = 'Torna alla Home';

            button.onclick = function() {
                window.location.href = '/';
            }
            div.appendChild(button);
            div.style.display = 'block';

        }
    });
}
function stop_check_game_status() {
    clearInterval(intervalIdStatus);
}