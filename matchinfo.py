import requests
from info import id_by_name
from info import get_duration


class IndMatch:
    def __init__(self, identifier):
        self.name = None
        self.id = identifier
        self.teams = []
        self.winner = None
        self.duration = None

    def get_info(self):
        r = requests.get(f"https://opendota.com/api/matches/{self.id}")
        match_js = r.json()
        self.name = match_js["league"]["name"]
        duration = match_js["duration"]
        self.duration = get_duration(duration)
        radt = match_js["radiant_team"]
        dirt = match_js["dire_team"]
        t1n = radt["name"]
        t2n = dirt["name"]
        team1 = MTeam(t1n)
        team2 = MTeam(t2n)
        self.teams = [team1, team2]
        players = match_js["players"]
        for player in players:
            name = player["name"]
            mplayer = MPlayer(name)
            mplayer.kills = player["hero_kills"]
            mplayer.deaths = player["deaths"]
            mplayer.assistance = player["assists"]
            if player["isRadiant"]:
                self.teams[0].players.append(mplayer)
            else:
                self.teams[1].players.append(mplayer)
        if match_js["radiant_win"]:
            self.winner = self.teams[0].name
        else:
            self.winner = self.teams[1].name



    def __repr__(self):
        return f"{self.name}, {self.id}, {self.teams[0].players}, {self.teams[1].players}, {self.winner}, {self.duration}"




class MPlayer:
    def __init__(self, name):
        self.name = name
        self.side = None
        self.kills = 0
        self.deaths = 0
        self.assistance = 0

    def __str__(self):
        return f"name: {self.name},kills: {self.kills}, deaths: {self.deaths}, assistance: {self.assistance}"


class MTeam:
    def __init__(self, name):
        self.name = name
        self.players = []




def get_match(identifier):
    match = IndMatch(identifier)
    match.get_info()
    return match


# match = IndMatch("hi")
# match.get_info()
# r1 = requests.get(f"https://opendota.com/api/matches/5444146803")
# print(r1.json())

match = get_match(5444494373)

print(match)


