import pandas as pd
import json
from datetime import datetime
import openpyxl
import sys

# Load data from players.json file
with open("players.json", "r") as file:
    data = json.load(file)

# Convert to DataFrame
df = pd.DataFrame(data)

# Calculate role scores for each player
df['DefenderScore'] = df['Defense'] * 0.5 + df['Physicality'] * 0.3 + df['Mental'] * 0.2
df['MidfielderScore'] = df['Passing'] * 0.4 + df['Dribbling'] * 0.3 + df['Mental'] * 0.3
df['ForwardScore'] = df['Shooting'] * 0.4 + df['Dribbling'] * 0.3 + df['Pace'] * 0.3

# Assign roles based on the highest score
df['AssignedRole'] = df[['DefenderScore', 'MidfielderScore', 'ForwardScore']].idxmax(axis=1)
df['AssignedRole'] = df['AssignedRole'].replace({
    'DefenderScore': 'DEF', 'MidfielderScore': 'MID', 'ForwardScore': 'FWD'
})

# Calculate rating by rounding the max score
df['Rating'] = df[['DefenderScore', 'MidfielderScore', 'ForwardScore']].max(axis=1).round(0).astype(int)

# Check if 'PR' argument is provided
if len(sys.argv) > 1 and sys.argv[1] == "PR":
    # PR Mode: Display each player's role and rating
    for _, player in df.iterrows():
        print(f"{player['Name']}: {player['AssignedRole']} : {player['Rating']}")
else:
    # Default Mode: Only distribute players marked as "Playing: true"
    df_playing = df[df['Playing'] == 'true']

    # Sort players within each role
    defenders = df_playing[df_playing['AssignedRole'] == 'DEF'].sort_values(by='DefenderScore', ascending=False)
    midfielders = df_playing[df_playing['AssignedRole'] == 'MID'].sort_values(by='MidfielderScore', ascending=False)
    forwards = df_playing[df_playing['AssignedRole'] == 'FWD'].sort_values(by='ForwardScore', ascending=False)

    # Initialize teams
    team_green = []
    team_orange = []

    # Function to distribute players evenly by alternating between teams
    def distribute_players(players, team1, team2):
        for i, (_, player) in enumerate(players.iterrows()):
            entry = f"{player['Name']} ({player['AssignedRole']})"
            if len(team1) <= len(team2):
                team1.append(entry)
            else:
                team2.append(entry)

    # Distribute players by role to ensure balance
    distribute_players(defenders, team_green, team_orange)
    distribute_players(midfielders, team_green, team_orange)
    distribute_players(forwards, team_green, team_orange)

    # Print results in console
    print("Green Team:", team_green)
    print("Orange Team:", team_orange)

    # Save results to Excel with date in the filename
    today = datetime.today().strftime('%Y-%m-%d')
    filename = f"Team_Distribution_{today}.xlsx"

    # Create a DataFrame for Excel output
    teams_data = {
        'Orange Team': pd.Series(team_orange),
        'Green Team': pd.Series(team_green)
    }
    teams_df = pd.DataFrame(teams_data)
    teams_df.fillna('', inplace=True)  # Fill NaN values with empty string for clean output

    # Apply color formatting and save to Excel
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        teams_df.to_excel(writer, index=False, sheet_name='Team Distribution')
        worksheet = writer.sheets['Team Distribution']

        # Apply color formatting
        orange_fill = openpyxl.styles.PatternFill(start_color="FFD966", end_color="FFD966", fill_type="solid")
        green_fill = openpyxl.styles.PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")

        for row in range(2, len(team_orange) + 2):
            worksheet[f'A{row}'].fill = orange_fill
        for row in range(2, len(team_green) + 2):
            worksheet[f'B{row}'].fill = green_fill

    print(f"Teams have been saved to {filename}")
