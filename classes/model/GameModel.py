
class GameModel:
    def __init__(self, game_id, status):
        self.game_id = game_id
        self.status = status
    def get_game_id(self):
        return self.game_id
    def get_status(self):
        return self.status
    def set_game_id(self, game_id):
        self.game_id = game_id
    def set_status(self, status):
        self.status = status
