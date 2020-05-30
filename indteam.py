import requests
from info import id_by_name
from liquipediapy import dota

dota_obj = dota("CyberInfo")

class IndTeam:
    def __init__(self, name):
        self.name = name
        self.id = id_by_name(name)[0]
        self.players = []
        self.wins = 0
        self.losses = 0
        self.logo = None

    def __repr__(self):
        return f"Name: {self.name}, participants: {self.players}, wins: {self.wins}, losses: {self.losses}"


    def fill_team_info(self, name):
        r = requests.get(f"https://opendota.com/api/teams/{self.id}")
        r2 = requests.get(f"https://opendota.com/api/teams/{self.id}/players")
        info = r.json()
        players = r2.json()
        print(players)
        for player in players:
            if player["is_current_team_member"] and player["name"]:
                self.players.append(player["name"])
        print(self.players)


team = IndTeam("natus vincere")
team.fill_team_info(team.name)

team_details = dota_obj.get_team_info('Natus Vincere', False)
print(team_details)
