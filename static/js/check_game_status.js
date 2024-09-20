
function check_game_status() {
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
            p.innerHTML = 'Hanno Hackerato il tuo Database Centrale! <br>La Guerra è terminata. Ha vinto ' + data.winner + '.';
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