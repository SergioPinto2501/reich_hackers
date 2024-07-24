
from flask import Flask,render_template,request
from player import Player
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/homepage_game_allies')
def homepage_game_allies():
    Player1 = Player("Player1", "Allies")
    Player2 = Player("Player2", "Allies")
    print(Player1.toString() + " vs " + Player2.toString())
    return render_template('vistaAlleati/index.html')
@app.route('/homepage_game_axis')
def homepage_game_axis():
    return render_template('vistaAsse/index.html')

if __name__ == '__main__':
    app.run(debug=True)

