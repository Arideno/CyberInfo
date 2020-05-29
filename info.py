import requests
import time


class Team:
    def __init__(self, identifier, name, wins, losses):
        self.id = identifier
        self.name = name
        self.wins = wins
        self.losses = losses

    def __repr__(self):
        return f"Id: {self.id}, name: {self.name}, wins: {self.wins}, losses: {self.losses}"


class Match:
    def __init__(self, name, radiant, dire, duration, winner):
        self.name = name
        self.radiant = radiant
        self.dire = dire
        self.duration = duration
        self.winner = winner

    def __repr__(self):
        return f"Name: {self.name}, radiant: {self.radiant}, dire: {self.dire}, duration: {self.duration}, winner: {self.winner}"


def team_list():
    teams = []
    r = requests.get("https://opendota.com/api/teams")
    ct = int(time.time())
    js_teams = r.json()
    month = ct - 2592000
    for team in js_teams:
        if not team["last_match_time"]:
            continue
        if team["last_match_time"] > month:
            identifier = team["team_id"]
            name = team["name"]
            wins = team["wins"]
            losses = team["losses"]
            if not wins:
                wins = 0
            if not losses:
                losses = 0
            if identifier and name:
                t = Team(identifier, name, wins, losses)
                teams.append(t)

    teams.sort(key=lambda team: team.name.lower())
    return teams


def get_duration(seconds):
    minutes = seconds // 60
    sec = seconds - minutes * 60
    dur = f"{minutes}:{sec}"
    return dur


def recent_matches(number=5):
    matches = []
    r = requests.get("https://opendota.com/api/promatches")
    js_matches = r.json()
    for i in range(number):
        match = js_matches[i]
        name = match["league_name"]
        radiant = match["radiant_name"]
        dire = match["dire_name"]
        if match["duration"]:
            duration = get_duration(int(match["duration"]))
            winner = radiant if match["radiant_win"] else dire
        if dire and radiant:
            match = Match(name, radiant, dire, duration, winner)
            matches.append(match)

    return matches


m = recent_matches()
for match in m:
    print(match)



