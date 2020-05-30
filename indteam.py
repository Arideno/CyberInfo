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
        self.coach = None
        self.captain = None
        self.country = None
        self.losses = 0
        self.logo = None
        self.index = None

    def __repr__(self):
        return f"{self.name}, {self.coach}, {self.captain}, {self.players}," \
               f" {self.country}, {self.wins}, {self.losses}"

    def fill_team_info(self, name):
        idname = id_by_name(name)
        if name == "navi":
            self.name = "Natus Vincere"
        else:
            self.name = idname[1]
        try:
            r1 = requests.get(f"https://opendota.com/api/teams/{idname[0]}")
        except:
            return None
        try:
            r2 = dota_obj.get_team_info(self.name, False)
        except:
            return None
        js_info = r1.json()
        try:
            self.wins = js_info["wins"]
        except:
            pass
        try:
            self.losses = js_info["losses"]
        except:
            pass
        try:
            self.coach = r2["info"]["coach"]
        except:
            pass
        try:
            self.captain = r2["info"]["team captain"]
        except:
            pass
        try:
            self.country = r2["info"]["location"]
        except:
            pass
        try:
            players = r2["team_roster"]
            for player in players:
                self.players.append(player["ID"])
        except:
            pass
        try:
            self.logo = js_info["logo_url"]
        except:
            pass
        self.index = get_win_index(self.wins, self.losses)

def get_win_index(x, y):
    per = x + y
    try:
        per1 = 100 / per
    except:
        return 0
    win = x * per1
    return win


def team_about(name):
    team = IndTeam(name)
    team.fill_team_info(name)
    return team


team = team_about("natus vincere")
print(team)


