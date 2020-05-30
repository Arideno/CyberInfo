import requests
from liquipediapy import dota

dota_obj = dota("CyberInfo")


class Player:
    def __init__(self, nick):
        self.nick = nick
        self.name = None
        self.romanized = None
        self.age = None
        self.country = None
        self.photo = None
        self.teams = []

    def __repr__(self):
        return f"{self.nick}, {self.name}, {self.age}, {self.country}, {self.teams}"

    def fill_player_info(self):
        details = dota_obj.get_player_info(self.nick, True)
        info = details["info"]
        self.name = info["name"]
        try:
            self.romanized = info["romanized_name"]
        except:
            pass
        birth = info["birth_details"]
        age = ""
        for i in range(len(birth)):
            if len(birth)-4 < i < len(birth)-1:
                age += birth[i]
        self.age = int(age)
        self.country = info["country"]
        self.photo = info["image"]
        teams = details["history"]
        for t in teams:
            self.teams.append(t["name"])


def get_player(name):
    player = Player(name)
    player.fill_player_info()
    return player

# player = get_player("s4")
# print(player)