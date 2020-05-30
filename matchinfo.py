import requests
from info import id_by_name


class IndMatch:
    def __init__(self, identifier):
        self.name = None
        self.id = identifier
        self.teams = []
        self.winner = None

    def get_info(self):
        r = requests.get(f"https://opendota.com/api/matches/{self.id}")
        match_js = r.json()
        self.name = match_js["league"]["name"]
        radt = match_js["radiant_team"]
        dirt = match_js["dire_team"]
        t1n = radt["name"]
        t2n = dirt["name"]
        team1 = MTeam(t1n)
        team2 = MTeam(t2n)
        self.teams = [team1, team2]
        players = match_js["players"]
        for player in players:
            name = player["personaname"]
            if player["isRadiant"]:
                self.teams[0].players.append(name)
            else:
                self.teams[1].players.append(name)
        if match_js["radiant_win"]:
            self.winner = self.teams[0].name
        else:
            self.winner = self.teams[1].name



    def __repr__(self):
        return f"{self.name}, {self.id}, {self.teams[0].players}, {self.teams[1].players}, {self.winner}"




class MPlayer:
    def __init__(self, name):
        self.name = name
        self.side = None
        kills = 0
        deaths = 0
        assistance = 0


class MTeam:
    def __init__(self, name):
        self.name = name
        self.players = []


# match = IndMatch("hi")
# match.get_info()
# r1 = requests.get(f"https://opendota.com/api/matches/5444146803")
# print(r1.json())

match = IndMatch(5444146803)
match.get_info()
print(match)

