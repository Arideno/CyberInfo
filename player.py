import requests
from liquipediapy import dota

dota_obj = dota("CyberInfo")


class Player:
    def __init__(self, nick):
        self.nick = nick
        self.name = None
        self.age = None
        self.country = None
        self.photo = None
        self.teams = []

    def __repr__(self):
        return f"{self.nick}, {self.name}, {self.age}, {self.country}, {self.teams}"


    def fill_[alyer]

player_details = dota_obj.get_player_info('hao', True)
print(player_details)