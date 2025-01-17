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
    def __init__(self, name, radiant, dire, duration, start, winner):
        self.name = name
        self.id = None
        self.radiant = radiant
        self.dire = dire
        self.duration = duration
        self.start = start
        self.winner = winner

    def __repr__(self):
        return f"Name: {self.name}, radiant: {self.radiant}, dire: {self.dire}, duration: {self.duration}, start: {self.start} winner: {self.winner}"


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
    dur = "{:02d}:{:02d}".format(minutes, sec)
    return dur


def recent_matches(number=5):
    matches = []
    r = requests.get("https://opendota.com/api/promatches")
    js_matches = r.json()
    for i in range(number):
        match = js_matches[i]
        identifier = match["match_id"]
        name = match["league_name"]
        radiant = match["radiant_name"]
        dire = match["dire_name"]
        if match["duration"]:
            start = match["start_time"]
            duration = get_duration(int(match["duration"]))
            winner = radiant if match["radiant_win"] else dire
            if dire and radiant:
                match = Match(name, radiant, dire, duration, start, winner)
                match.id = identifier
                matches.append(match)
    return matches

def team_matches(name, number=5):
    if name.lower() == "navi":
        name = "Natus Vinceres"
    identifier = id_by_name(name)[0]
    if identifier is None:
        return None
    matches = []
    r = requests.get(f"https://opendota.com/api/teams/{identifier}")
    tname = r.json()["name"]
    r2 = requests.get(f"https://opendota.com/api/teams/{identifier}/matches")
    js_r2 = r2.json()
    for i in range(number):
        match = js_r2[i]
        mname = match["league_name"]
        identifier = match["match_id"]
        if match["radiant"]:
            radiant = tname
            dire = match["opposing_team_name"]
        else:
            radiant = match["opposing_team_name"]
            dire = tname
        if match["duration"]:
            start = match["start_time"]
            duration = get_duration(int(match["duration"]))
            winner = radiant if match["radiant_win"] else dire
            match = Match(mname, radiant, dire, duration, start, winner)
            match.id = identifier
            matches.append(match)
    return matches


def id_by_name(name):
    r = requests.get("https://opendota.com/api/teams")
    teams = r.json()
    min = 5
    ret = None
    for t in teams:
        levenshtein = levenshtein_distance(name.lower(), t["name"].lower())
        if t["name"].lower() == name.lower():
            return t["team_id"], t["name"]
        elif levenshtein < min:
            min = levenshtein
            ret = t["team_id"], t["name"]
    return ret


def levenshtein_distance(word1, word2):
    n = len(word1) + 1
    m = len(word2) + 1
    matrix = [['*' for _ in range(n)] for _ in range(m)]
    for i in range(n):
        matrix[0][i] = i
    for j in range(m):
        matrix[j][0] = j
    for i in range(1, m):
        for j in range(1, n):
            if word1[j - 1] != word2[i - 1]:
                matrix[i][j] = min(matrix[i - 1][j], matrix[i - 1][j - 1], matrix[i][j - 1]) + 1
            else:
                matrix[i][j] = matrix[i - 1][j - 1]
    return matrix[m - 1][n - 1]


def team_matches_by_id(identifier, number=5):
    matches = []
    r = requests.get(f"https://opendota.com/api/teams/{identifier}")
    tname = r.json()["name"]
    r2 = requests.get(f"https://opendota.com/api/teams/{identifier}/matches")
    js_r2 = r2.json()
    for i in range(number):
        match = js_r2[i]
        mname = match["league_name"]
        if match["radiant"]:
            radiant = tname
            dire = match["opposing_team_name"]
        else:
            radiant = match["opposing_team_name"]
            dire = tname
        if match["duration"]:
            start = match["start_time"]
            duration = get_duration(int(match["duration"]))
            winner = radiant if match["radiant_win"] else dire
            match = Match(mname, radiant, dire, duration, start, winner)
            matches.append(match)
    return matches
