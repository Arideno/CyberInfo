from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
import telegram
from telegram.ext import Dispatcher, Updater, CommandHandler, Filters, CallbackQueryHandler
from telegram import ChatAction, Bot, Update, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton
import logging
from .info import recent_matches, team_list, team_matches, levenshtein_distance, id_by_name
from functools import wraps
import emoji
from mailing.models import Mailing, MailingAll
from .indteam import team_about
from .player import get_player
from .matchinfo import get_match
import flag

logger = logging.getLogger(__name__)

bot = Bot(settings.TELEGRAM_BOT_TOKEN)

def send_typing_action(func):
    """Sends typing action while processing func command."""

    @wraps(func)
    def command_func(update, context, *args, **kwargs):
        context.bot.send_chat_action(chat_id=update.effective_message.chat_id, action=ChatAction.TYPING)
        return func(update, context, *args, **kwargs)

    return command_func


logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

def build_menu(buttons,
               n_cols,
               header_buttons=None,
               footer_buttons=None):
    menu = [buttons[i:i + n_cols] for i in range(0, len(buttons), n_cols)]
    if header_buttons:
        menu.insert(0, [header_buttons])
    if footer_buttons:
        menu.append([footer_buttons])
    return menu

def get_match_info(update, context, id):
    match = get_match(id)
    string = '''
<b><i>{}</i></b>

Duration: <b>{}</b>

<b>Radiant</b>
<b><code>{}</code></b>{}
'''.format(match.name, match.duration, match.teams[0].name.replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;'), emoji.emojize(':trophy:', use_aliases=True) if match.winner == match.teams[0].name else '')

    for i in range(5):
        string += '''
{} ({}/{}/{})
        '''.format(match.teams[0].players[i].name.replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;'), match.teams[0].players[i].kills, match.teams[0].players[i].deaths, match.teams[0].players[i].assistance)
    string += '''
<b>Dire</b>
<b><code>{}</code></b>{}
    '''.format(match.teams[1].name.replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;'), emoji.emojize(':trophy:', use_aliases=True) if match.winner == match.teams[1].name else '')

    for i in range(5):
        string += '''
{} ({}/{}/{})        
'''.format(match.teams[1].players[i].name.replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;'), match.teams[1].players[i].kills, match.teams[1].players[i].deaths, match.teams[1].players[i].assistance)

    context.bot.send_message(chat_id=update.effective_chat.id, text=string, parse_mode='HTML')

@send_typing_action
def match_button(update, context):
    query = update.callback_query
    query.answer()
    get_match_info(update, context, query.data)

@send_typing_action
def get_last_matches(update, context):
    matches = recent_matches(5)
    button_list = []
    for i in range(len(matches)):
        button_list.append(InlineKeyboardButton(str(i+1), callback_data=matches[i].id))
    reply_markup = InlineKeyboardMarkup(build_menu(button_list, n_cols=1))
    string = "<b>Recent Matches:</b>\n\n\n"
    for match in matches:
        string += f'<b>{match.name}</b>\n'
        string += f'<i>Radiant</i>: {match.radiant} {emoji.emojize(":trophy:", use_aliases=True) if match.winner == match.radiant else ""}\n'
        string += f'<i>Dire</i>: {match.dire} {emoji.emojize(":trophy:", use_aliases=True) if match.winner == match.dire else ""}\n'
        string += f'Game duration: <b>{match.duration}</b>\n\n'
    context.bot.send_message(chat_id=update.effective_chat.id, reply_markup=reply_markup, text=string, parse_mode=telegram.ParseMode.HTML)


@send_typing_action
def get_teams(update, context):
    teams = team_list()
    string = "<b>Teams:</b>\n\n"
    for team in teams[:len(teams)//2]:
        string += f'<code><b>{team.name}</b></code> {emoji.emojize(":sparkles:", use_aliases=True)}'
    context.bot.send_message(chat_id=update.effective_chat.id, text=string, parse_mode=telegram.ParseMode.HTML)
    string = ''
    for team in teams[len(teams)//2:]:
        string += f'<code><b>{team.name}</b></code> {emoji.emojize(":sparkles:", use_aliases=True)}'
    context.bot.send_message(chat_id=update.effective_chat.id, text=string, parse_mode=telegram.ParseMode.HTML)


@send_typing_action
def get_team_matches(update, context):
    args = context.args
    try:
        name = ' '.join(x for x in args)
        if name == '':
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
            return
    except:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
        return
    matches = team_matches(name, 5)
    button_list = []
    for i in range(len(matches)):
        button_list.append(InlineKeyboardButton(str(i+1), callback_data=matches[i].id))
    reply_markup = InlineKeyboardMarkup(build_menu(button_list, n_cols=1))
    team = matches[0].radiant if levenshtein_distance(name.lower(), matches[0].radiant.lower()) < 4 else matches[0].dire
    string = f"<b>{team} matches:</b>\n\n\n"
    for match in matches:
        string += f'<b>{match.name}</b>\n'
        string += f'<i>Radiant</i>: {match.radiant} {emoji.emojize(":trophy:", use_aliases=True) if match.winner == match.radiant else ""}\n'
        string += f'<i>Dire</i>: {match.dire} {emoji.emojize(":trophy:", use_aliases=True) if match.winner == match.dire else ""}\n'
        string += f'Game duration: <b>{match.duration}</b>\n\n'
    context.bot.send_message(chat_id=update.effective_chat.id, reply_markup=reply_markup, text=string, parse_mode=telegram.ParseMode.HTML)


@send_typing_action
def subscribe_to_team(update, context):
    args = context.args
    try:
        name = ' '.join(x for x in args)
        if name == '':
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
            return
        mails = Mailing.objects.all()
        id = None
        team_name = None
        for mail in mails:
            if levenshtein_distance(mail.team_name.lower(), name.lower()) < 4:
                id = mail.team_id
                team_name = mail.team_name
                break
        if not id:
            t = id_by_name(name)
            if not t:
                id = None
            else:
                id, team_name = t
        if not id:
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, there is no such team, try another query')
            return
    except:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
        return
    num_results = Mailing.objects.filter(team_id=id, chat_id=update.effective_chat.id).count()
    if num_results == 0:
        Mailing.objects.create(team_id=id, team_name=team_name, chat_id=update.effective_chat.id)
        context.bot.send_message(chat_id=update.effective_chat.id, text='You have successfully subscribed to this team')
    else:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, you have already subscribed to this team')

@send_typing_action
def subscribe_to_all(update, context):
    mails = MailingAll.objects.filter(chat_id=update.effective_chat.id)
    if mails.count() == 1:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, you have already subscribed to this team')
    else:
        MailingAll.objects.create(chat_id=update.effective_chat.id)
        context.bot.send_message(chat_id=update.effective_chat.id, text='You have successfully subscribed to update')

@send_typing_action
def unsubscribe_to_all(update, context):
    mails = MailingAll.objects.filter(chat_id=update.effective_chat.id)
    if mails.count() == 0:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, you have not subscribed yet')
    else:
        mails.first().delete()
        context.bot.send_message(chat_id=update.effective_chat.id, text='You have successfully unsubscribed')

@send_typing_action
def unsubscribe_to_team(update, context):
    args = context.args
    try:
        name = ' '.join(x for x in args)
        if name == '':
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
            return
        mails = Mailing.objects.filter(chat_id=update.effective_chat.id)
        m = None
        for mail in mails:
            if levenshtein_distance(mail.team_name.lower(), name.lower()) < 4:
                m = mail
                break
        if not m:
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, there is no such team, try another query')
            return
    except:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
        return
    m.delete()
    context.bot.send_message(chat_id=update.effective_chat.id, text='You have successfully unsubscribed to this team')

import pycountry

@send_typing_action
def get_team_info(update, context):
    args = context.args
    try:
        name = ' '.join(x for x in args)
        if name == '':
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
            return
        team = team_about(name)
        if team is None:
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
            return
    except:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
        return
    if team.logo is not None:
        try:
            context.bot.send_photo(chat_id=update.effective_chat.id, photo=team.logo)
        except:
            pass
    string = f'<b><code>{team.name}</code></b>\n'
    string += f"<i>Wins: {team.wins}, Losses: {team.losses}\n<b>W/L: {round(team.index, 2)}</b></i>\n"
    if team.country is not None:
        if team.country[0] == 'Europe':
            string += 'Country: 🇪🇺\n'
        else:
            try:
                string += "Country: {}\n".format(flag.flag(pycountry.countries.search_fuzzy(team.country[0]+' '+team.country[1])[0].alpha_2))
            except:
                try:
                    string += "Country: {}\n".format(flag.flag(pycountry.countries.search_fuzzy(team.country[0])[0].alpha_2))
                except:
                    string += f'Country: {team.country[0]}\n'
    if team.coach is not None:
        string += "Coach: <b><code>{}</code></b>\n".format(team.coach)
    if team.captain is not None:
        string += "Captain: <b><code>{}</code></b>\n".format(team.captain)
    if len(team.players) == 0:
        string += 'Currently no active players'
    else:
        string += "Players:\n"
        for player in team.players:
            string += "<b><code>{}</code></b>\n".format(player)
    context.bot.send_message(chat_id=update.effective_chat.id, text=string, parse_mode='HTML')
    
@send_typing_action
def get_player_info(update, context):
    args = context.args
    try:
        name = ' '.join(x for x in args)
        if name == '':
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
            return
        player = get_player(name)
        if player is None:
            context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
            return
    except:
        context.bot.send_message(chat_id=update.effective_chat.id, text='Oops, it seams your query is wrong')
        return

    if player.photo is not None:
        context.bot.send_photo(chat_id=update.effective_chat.id, photo=player.photo)
    string = f'Name: <b><code>{player.name}</code></b>'
    if player.romanized is not None:
        string += f"(<i>{player.romanized}</i>)\n"
    else:
        string += '\n'
    string += f'Nickname: <b><code>{player.nick}</code></b>\n'
    if player.age is not None:
        string += f'Age: <i>{player.age}</i>\n'
    if player.country is not None:
        if player.country[0] == 'Europe':
            string += 'Country: 🇪 🇺 \n'
        else:
            try:
                string += "Country: {}\n".format(flag.flag(pycountry.countries.search_fuzzy(player.country[0]+' '+player.country[1])[0].alpha_2))
            except:
                try:
                    string += "Country: {}\n".format(flag.flag(pycountry.countries.search_fuzzy(player.country[0])[0].alpha_2))
                except:
                    string += f'Country: {player.country[0]}\n'
    string += 'Teams played for:\n'
    i = 0
    for team in player.teams:
        i += 1
        string += f'<b><code>{team}</code></b>{emoji.emojize(":star:", use_aliases=True) if i == len(player.teams) else ""}\n'
    context.bot.send_message(chat_id=update.effective_chat.id, text=string, parse_mode='HTML')

def help(update, context):
    text = '''
/teams - get a list of all teams that were active during last 30 days
/matches - get a list of 5 last matches
/team_matches - get a list of 5 last matches, where the chosen team has taken part (/team_matches Natus Vincere)
/team_info - get an information about chosen team (/team_info Natus Vincere)
/player_info - get an information about chosen player (/player_info Dendi)
/subscribe - subscribe to updates on chosen team (/subscribe Natus Vincere)
/unsubscribe - unsubscribe to updates on chosen team (/unsubscribe Natus Vincere)
/subscribe_all -  subscribe to updates on all teams 
/unsubscribe_all - unsubscribe to updates on all teams
/help - Get a list of commands
'''
    context.bot.send_message(update.effective_chat.id, text=text)

dispatcher = Dispatcher(bot, None, workers=0, use_context=True)
dispatcher.add_handler(CommandHandler('matches', get_last_matches))
dispatcher.add_handler(CommandHandler('teams', get_teams))
dispatcher.add_handler(CommandHandler('team_matches', get_team_matches))
dispatcher.add_handler(CommandHandler('subscribe', subscribe_to_team))
dispatcher.add_handler(CommandHandler('unsubscribe', unsubscribe_to_team))
dispatcher.add_handler(CommandHandler('team_info', get_team_info))
dispatcher.add_handler(CommandHandler('player_info', get_player_info))
dispatcher.add_handler(CommandHandler('subscribe_all', subscribe_to_all))
dispatcher.add_handler(CommandHandler('unsubscribe_all', unsubscribe_to_all))
dispatcher.add_handler(CommandHandler('help', help))
dispatcher.add_handler(CommandHandler('start', help))
dispatcher.add_handler(CallbackQueryHandler(match_button))

import json

class UpdateBot(APIView):
    def post(self, request):
        json_str = json.loads(request.body.decode('utf-8'))
        update = Update.de_json(json_str, bot)
        dispatcher.process_update(update)
        return Response({'ok': True})

