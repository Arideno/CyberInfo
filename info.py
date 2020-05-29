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


def team_list():
    teams = []
    r = requests.get("https://opendota.com/api/teams")
    ct = int(time.time())
    js_teams = r.json()
    month = ct - 2592000
    for team in js_teams:
        if team["last_match_time"] > month:
            identifier = team["team_id"]
            name = team["name"]
            wins = team["wins"]
            losses = team["losses"]
            t = Team(identifier, name, wins, losses)
            teams.append(t)
    return teams



