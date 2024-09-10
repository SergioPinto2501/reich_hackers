window.onload = function() {
    check_game_status();
    setInterval(check_game_status, 60000);

}
function check_game_status() {
     fetch('/check_game_status/')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'end') {
            div = document.getElementById('message-for-player');
            h2 = document.createElement('h2');
            h2.innerHTML = 'Game Over';
            div.appendChild(h2);
            p = document.createElement('p');
            p.innerHTML = 'La Guerra è terminata. Ha vinto ' + data.winner + '.';
            div.appendChild(p);
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