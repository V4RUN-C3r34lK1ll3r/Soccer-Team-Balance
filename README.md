Team Soccer Balance Script
This script helps to balance a soccer team by assigning players to "Green Team" and "Orange Team" based on their skills and attributes.

Requirements
Python 3.6+
Libraries:
pandas
openpyxl
You can install the required libraries using:


pip install pandas openpyxl
Setup
Ensure the players.json file is in the same directory as Team-Balance.py. This file should contain player data with attributes such as Pace, Dribbling, Shooting, Passing, Defense, Physicality, and Mental.

players.json Example:

json
Copy code
[
    {
        "Name": "Player1",
        "Playing": "true",
        "Pace": 80,
        "Dribbling": 75,
        "Shooting": 85,
        "Passing": 70,
        "Defense": 65,
        "Physicality": 60,
        "Mental": 70
    },
    ...
]
Usage
Balance Teams for Active Players: To balance the teams based on players marked as Playing: true, run:


python Team-Balance.py
This command will print the balanced teams in the console and save them to an Excel file with color-coded teams.
The output file will be named Team_Distribution_<DATE>.xlsx (e.g., Team_Distribution_2024-11-11.xlsx).
Player Role and Rating Overview: To view each player's assigned role (DEF, MID, FWD) and rating, regardless of their "Playing" status, run:


python Team-Balance.py PR
This command will output each player's role and rating in the console in the format Name: Role : Rating.
Example Outputs
Balanced Teams (Default Mode):
less
Copy code
Green Team: ['Player1 (DEF)', 'Player2 (MID)', ...]
Orange Team: ['Player3 (DEF)', 'Player4 (MID)', ...]
Player Role & Rating (PR Mode):
vbnet
Copy code
Player1: DEF : 85
Player2: MID : 78
...
This README should help guide you through setting up and running the updated script with the new features. Let me know if you need further adjustments!