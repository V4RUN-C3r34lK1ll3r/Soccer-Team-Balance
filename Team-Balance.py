import pandas as pd
import json

# Sample JSON data as a string (Replace this with your actual JSON data)
players_json = """
[
    {"Name":"Vamshi","Stamina":2,"Dribbling":2,"ShotPower":4,"Passing":3,"Accuracy":3,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"MID"},
    {"Name":"Varun","Stamina":2,"Dribbling":3,"ShotPower":4,"Passing":4,"Accuracy":4,"Defense":2,"Playing":"true", "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"Bagyesh","Stamina":4,"Dribbling":4,"ShotPower":4,"Passing":3,"Accuracy":3,"Defense":5,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"DJ","Stamina":3,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":3,"Defense":4,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"Sagar","Stamina":2,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":2,"Playing":"false", "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Bilal","Stamina":1,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":3,"Playing":"false", "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"Jaiswal","Stamina":4,"Dribbling":2,"ShotPower":3,"Passing":2,"Accuracy":2,"Defense":3,"Playing":"true", "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"Saurab","Stamina":2,"Dribbling":3,"ShotPower":3,"Passing":2,"Accuracy":3,"Defense":3,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"Jithu","Stamina":3,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"true", "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"Dada","Stamina":2,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"abhijit","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":3,"Accuracy":2,"Defense":3,"Playing":"true", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"abhisehk","Stamina":3,"Dribbling":1,"ShotPower":4,"Passing":1,"Accuracy":1,"Defense":3,"Playing":"false", "PrimaryRole":"WS", "SecondaryRole":"DEF"},
    {"Name":"ketan","Stamina":2,"Dribbling":1,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"GK"},
    {"Name":"shailesh","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":3,"Playing":"true", "PrimaryRole":"DEF", "SecondaryRole":"WS"},
    {"Name":"kaustubh","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"nrupesh","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":3,"Defense":1,"Playing":"false", "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"sandeep","Stamina":2,"Dribbling":2,"ShotPower":3,"Passing":2,"Accuracy":3,"Defense":1,"Playing":"false", "PrimaryRole":"WS", "SecondaryRole":"GK"},
    {"Name":"vishnu","Stamina":3,"Dribbling":1,"ShotPower":1,"Passing":1,"Accuracy":2,"Defense":3,"Playing":"true", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"rajeev","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":3,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"kiran","Stamina":2,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":1,"Defense":2,"Playing":"false", "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"Summet","Stamina":3,"Dribbling":2,"ShotPower":1,"Passing":3,"Accuracy":2,"Defense":2,"Playing":"false", "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"anil","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":1,"Defense":1,"Playing":"false", "PrimaryRole":"WS", "SecondaryRole":"MID"},
    {"Name":"pranav","Stamina":2,"Dribbling":1,"ShotPower":2,"Passing":2,"Accuracy":1,"Defense":3,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"avinash","Stamina":1,"Dribbling":1,"ShotPower":2,"Passing":1,"Accuracy":1,"Defense":1,"Playing":"false", "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Prasad","Stamina":3,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":4,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"shailesh C","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"false", "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Paritosh","Stamina":3,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":3,"Defense":3,"Playing":"false", "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"Vignesh","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"false", "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"Nasiq","Stamina":2,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":3,"Defense":3,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"GK"},
    {"Name":"Amritpal","Stamina":3,"Dribbling":3,"ShotPower":4,"Passing":3,"Accuracy":4,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"Chirag","Stamina":3,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":4,"Defense":4,"Playing":"true", "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"Bharat","Stamina":4,"Dribbling":3,"ShotPower":3,"Passing":4,"Accuracy":3,"Defense":3,"Playing":"false", "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"harsha","Stamina":2,"Dribbling":3,"ShotPower":3,"Passing":3,"Accuracy":3,"Defense":2,"Playing":"true", "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"harsH","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":3,"Accuracy":2,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Deepak","Stamina":1,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":1,"Playing":"true", "PrimaryRole":"DEF", "SecondaryRole":"MID"},
    {"Name":"dheeraj","Stamina":2,"Dribbling":3,"ShotPower":4,"Passing":3,"Accuracy":4,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Chirag Friend","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"false", "PrimaryRole":"MID", "SecondaryRole":"MID"},
    {"Name":"Dnyanesh","Stamina":1,"Dribbling":2,"ShotPower":3,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"true", "PrimaryRole":"DEF", "SecondaryRole":"GK"},
    {"Name":"Sanjay","Stamina":3,"Dribbling":5,"ShotPower":3,"Passing":4,"Accuracy":4,"Defense":3,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"WS"},
    {"Name":"nuhu","Stamina":2,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":3,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"MID"},
    {"Name":"Kartik","Stamina":2,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":3,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Bhupinder","Stamina":2,"Dribbling":2,"ShotPower":2,"Passing":2,"Accuracy":2,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"DEF"},
    {"Name":"Sudeep","Stamina":2,"Dribbling":3,"ShotPower":2,"Passing":3,"Accuracy":3,"Defense":2,"Playing":"true", "PrimaryRole":"MID", "SecondaryRole":"DEF"}
]
"""

# Load data from JSON string
data = json.loads(players_json)

# Convert to DataFrame and filter only players who are 'Playing'
df = pd.DataFrame(data)
df = df[df['Playing'] == 'true']

# Calculate average score
df['Average'] = df[['Stamina', 'Dribbling', 'ShotPower', 'Passing', 'Accuracy', 'Defense']].mean(axis=1)

# Sorting players for fair distribution based on specific attributes
sorted_defense = df[df['PrimaryRole'] == 'DEF'].sort_values(by='Average', ascending=False)
sorted_mid = df[df['PrimaryRole'] == 'MID'].sort_values(by='Average', ascending=False)
sorted_ws = df[df['PrimaryRole'] == 'WS'].sort_values(by='Average', ascending=False)
sorted_gk = df[df['SecondaryRole'] == 'GK'].sort_values(by='Average', ascending=False)

# Initial team lists
team_green = []
team_orange = []

# Function to distribute players
def distribute_players(sorted_players, team1, team2, count):
    for i, player in sorted_players.iterrows():
        if player['Name'] not in team1 and player['Name'] not in team2:
            if len([p for p in team1 if df[df['Name'] == p]['PrimaryRole'].values[0] == player['PrimaryRole']]) < count:
                team1.append(player['Name'])
            elif len([p for p in team2 if df[df['Name'] == p]['PrimaryRole'].values[0] == player['PrimaryRole']]) < count:
                team2.append(player['Name'])
            else:
                if len(team1) <= len(team2):
                    team1.append(player['Name'])
                else:
                    team2.append(player['Name'])

# Distributing key players for balanced skills
distribute_players(sorted_gk, team_green, team_orange, 2)
distribute_players(sorted_mid, team_green, team_orange, 3)
distribute_players(sorted_defense, team_green, team_orange, 3)
distribute_players(sorted_ws, team_green, team_orange, 2)

# Distribute remaining players based on overall average
remaining_players = df[~df['Name'].isin(team_green + team_orange)]
sorted_remaining = remaining_players.sort_values(by='Average', ascending=False)
distribute_players(sorted_remaining, team_green, team_orange, float('inf'))

# Create an output dataframe for visualization
teams_data = {
    'Orange Team': pd.Series(team_orange),
    'Green Team': pd.Series(team_green)
}
teams_df = pd.DataFrame(teams_data)
teams_df.fillna('', inplace=True)  # Fill NaN values with empty string for clean output

# Optionally, save to an Excel file
teams_df.to_excel("Team_Distribution.xlsx", index=False)

# Output teams to console
print("Green Team:")
for player in team_green:
    print(player)

print("\nOrange Team:")
for player in team_orange:
    print(player)
