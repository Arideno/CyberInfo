import requests
from info import id_by_name


class IndMatch:
    def __init__(self, name):
        self.name = name
        self.id = id_by_name(name)
        self.teams = ()
        self.winner = None

    def get_info(self):
        r = requests.get(f"https://opendota.com/api/matches/{self.id}")

        print(r1.json)



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
r1 = requests.get(f"https://opendota.com/api/matches/5444146803")
print(r1.json())