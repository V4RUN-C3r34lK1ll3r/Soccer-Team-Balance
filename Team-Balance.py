import pandas as pd
import json

# Sample JSON data as a string (Replace this with your actual JSON data)
players_json = """
[
    {"Name":"Vamshi","Playing":"false", "Stamina":2,"Dribbling":3,"ShotPower":4,"Passing":3,"Accuracy":2,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"MID"},
    {"Name":"Varun","Playing":"true", "Stamina":2,"Dribbling":3,"ShotPower":4,"Passing":4,"Accuracy":4,"Defense":2, "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"Bagyesh","Playing":"false", "Stamina":4,"Dribbling":4,"ShotPower":4,"Passing":3,"Accuracy":3,"Defense":5, "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"DJ","Playing":"true", "Stamina":3,"Dribbling":2,"ShotPower":2,"Passing":3,"Accuracy":3,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"Sagar","Playing":"false", "Stamina":3,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":3, "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Bilal","Playing":"false", "Stamina":1,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":2, "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"Jaiswal","Playing":"true", "Stamina":4,"Dribbling":2,"ShotPower":3,"Passing":2,"Accuracy":3,"Defense":3, "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"Saurab","Playing":"false", "Stamina":1,"Dribbling":3,"ShotPower":3,"Passing":2,"Accuracy":2,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"Jithu","Playing":"true", "Stamina":3,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2, "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"Dada","Playing":"false", "Stamina":2,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"abhijit","Playing":"true", "Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":3,"Accuracy":2,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"abhisehk","Playing":"false", "Stamina":3,"Dribbling":2,"ShotPower":4,"Passing":1,"Accuracy":1,"Defense":3, "PrimaryRole":"WS", "SecondaryRole":"DEF"},
    {"Name":"ketan","Playing":"true", "Stamina":2,"Dribbling":2,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"GK"},
    {"Name":"shailesh","Playing":"true", "Stamina":2,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":2,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"WS"},
    {"Name":"kaustubh","Playing":"false", "Stamina":1,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2, "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"nrupesh","Playing":"false", "Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":3,"Defense":1, "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"sandeep","Playing":"false", "Stamina":2,"Dribbling":2,"ShotPower":3,"Passing":2,"Accuracy":3,"Defense":1, "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"vishnu","Playing":"true", "Stamina":3,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"rajeev","Playing":"true", "Stamina":2,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":2,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"kiran","Playing":"false", "Stamina":2,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":1,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"Summet","Playing":"false", "Stamina":3,"Dribbling":2,"ShotPower":1,"Passing":3,"Accuracy":2,"Defense":2, "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"anil","Playing":"false", "Stamina":1,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":1, "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"pranav","Playing":"false", "Stamina":2,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":1,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"avinash","Playing":"false", "Stamina":1,"Dribbling":1,"ShotPower":2,"Passing":1,"Accuracy":1,"Defense":1, "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Prasad","Playing":"false", "Stamina":3,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"shailesh C","Playing":"false", "Stamina":2,"Dribbling":2,"ShotPower":3,"Passing":3,"Accuracy":2,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Paritosh","Playing":"true", "Stamina":3,"Dribbling":3,"ShotPower":2,"Passing":2,"Accuracy":3,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"Vignesh","Playing":"false", "Stamina":2,"Dribbling":3,"ShotPower":3,"Passing":2,"Accuracy":2,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"Nasiq","Playing":"true", "Stamina":2,"Dribbling":4,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":3, "PrimaryRole":"MID", "SecondaryRole":"GK"},
    {"Name":"Amritpal","Playing":"false", "Stamina":3,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"Chirag","Playing":"true", "Stamina":3,"Dribbling":3,"ShotPower":3,"Passing":4,"Accuracy":4,"Defense":4, "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"Bharat","Playing":"false", "Stamina":4,"Dribbling":4,"ShotPower":3,"Passing":4,"Accuracy":3,"Defense":3, "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"harsha","Playing":"true", "Stamina":2,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":2, "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"harsH","Playing":"false", "Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":3,"Accuracy":2,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Deepak","Playing":"false", "Stamina":2,"Dribbling":2,"ShotPower":3,"Passing":2,"Accuracy":2,"Defense":1, "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"Dheeraj","Playing":"true", "Stamina":2,"Dribbling":3,"ShotPower":4,"Passing":3,"Accuracy":4,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Chirag Friend","Playing":"false", "Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"MID"},
    {"Name":"Dnyanesh","Playing":"true", "Stamina":1,"Dribbling":2,"ShotPower":3,"Passing":2,"Accuracy":1,"Defense":1, "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"Sanjay","Playing":"true", "Stamina":3,"Dribbling":5,"ShotPower":3,"Passing":4,"Accuracy":4,"Defense":3, "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"nuhu","Playing":"true", "Stamina":3,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":3,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"MID"},
    {"Name":"Kartik","Playing":"true", "Stamina":2,"Dribbling":1,"ShotPower":2,"Passing":1,"Accuracy":1,"Defense":1, "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Bhupinder","Playing":"true", "Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2, "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Sudeep","Playing":"false", "Stamina":2,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":2,"Defense":3, "PrimaryRole":"DEF", "SecondaryRole":"DEF"}
]
"""

# Load data from JSON string
data = json.loads(players_json)

# Convert to DataFrame and filter only players who are 'Playing'
df = pd.DataFrame(data)
df = df[df['Playing'] == 'true']

# Calculate average score
df['Average'] = df[['Stamina', 'Dribbling', 'ShotPower', 'Passing', 'Accuracy', 'Defense']].mean(axis=1)

# Sort players alphabetically by name
df = df.sort_values(by=['Name'])

# Sorting players for fair distribution based on specific attributes
sorted_gk = df[df['SecondaryRole'] == 'GK'].sort_values(by='Average', ascending=False)
sorted_mid = df[df['PrimaryRole'] == 'MID'].sort_values(by='Average', ascending=False)
sorted_defense = df[df['PrimaryRole'] == 'DEF'].sort_values(by='Average', ascending=False)
sorted_ws = df[df['PrimaryRole'] == 'WS'].sort_values(by='Average', ascending=False)

# Initial team lists
team_green = []
team_orange = []

# Function to distribute players by role
def distribute_players_by_role(primary_role, count, team1, team2):
    sorted_players = df[df['PrimaryRole'] == primary_role].sort_values(by='Average', ascending=False)
    for i, player in sorted_players.iterrows():
        if player['Name'] not in team1 and player['Name'] not in team2:
            if len([p for p in team1 if df[df['Name'] == p]['PrimaryRole'].values[0] == primary_role]) < count:
                team1.append(player['Name'])
            elif len([p for p in team2 if df[df['Name'] == p]['PrimaryRole'].values[0] == primary_role]) < count:
                team2.append(player['Name'])
            else:
                if len(team1) <= len(team2):
                    team1.append(player['Name'])
                else:
                    team2.append(player['Name'])

# Function to distribute goalkeepers
def distribute_goalkeepers(sorted_players, team1, team2):
    for i, player in sorted_players.iterrows():
        if player['Name'] not in team1 and player['Name'] not in team2:
            if len([p for p in team1 if df[df['Name'] == p]['SecondaryRole'].values[0] == 'GK']) < 1:
                team1.append(player['Name'])
            elif len([p for p in team2 if df[df['Name'] == p]['SecondaryRole'].values[0] == 'GK']) < 1:
                team2.append(player['Name'])
            else:
                if len(team1) <= len(team2):
                    team1.append(player['Name'])
                else:
                    team2.append(player['Name'])

# Distributing key players for balanced skills
distribute_goalkeepers(sorted_gk, team_green, team_orange)
distribute_players_by_role('MID', 3, team_green, team_orange)
distribute_players_by_role('DEF', 3, team_green, team_orange)
distribute_players_by_role('WS', 2, team_green, team_orange)

# Distribute remaining players based on overall average
remaining_players = df[~df['Name'].isin(team_green + team_orange)]
sorted_remaining = remaining_players.sort_values(by='Average', ascending=False)
for i, player in sorted_remaining.iterrows():
    if len(team_green) <= len(team_orange):
        team_green.append(player['Name'])
    else:
        team_orange.append(player['Name'])

# Function to assign captain
def assign_captain(team):
    return df[df['Name'].isin(team)].sort_values(by='Average', ascending=False)['Name'].iloc[0]

# Assign captains and move them to the top of their respective teams
green_captain = assign_captain(team_green)
orange_captain = assign_captain(team_orange)

team_green.remove(green_captain)
team_orange.remove(orange_captain)

team_green.insert(0, green_captain)
team_orange.insert(0, orange_captain)

# Function to get player details
def get_player_details(name):
    player = df[df['Name'] == name].iloc[0]
    return f"{name} ({player['PrimaryRole']}/{player['SecondaryRole']})"

# Create an output dataframe for visualization
teams_data = {
    'Orange Team': pd.Series([get_player_details(name) for name in team_orange]),
    'Green Team': pd.Series([get_player_details(name) for name in team_green])
}
teams_df = pd.DataFrame(teams_data)
teams_df.fillna('', inplace=True)  # Fill NaN values with empty string for clean output

# Optionally, save to an Excel file
teams_df.to_excel("Team_Distribution.xlsx", index=False)

# Output teams to console
print("Green Team:")
for player in team_green:
    print(get_player_details(player))

print("\nOrange Team:")
for player in team_orange:
    print(get_player_details(player))
