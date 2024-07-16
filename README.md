...- .- .-. ..- -. -.-. . .-. . .- .-.. -.- .. .-.. .-.. . .-.V4RUN-C3r34lK1ll3r


# Team Balancer Script

## Overview
This script is designed to balance sports teams based on player attributes. Players are categorized by their primary and secondary roles and distributed into two balanced teams.

## Requirements
- Python 3.6 or above
- `pandas` library
- `openpyxl` library (if saving results to Excel)

## Installation
1. Ensure Python 3.6 or above is installed on your system.
2. Install the required libraries:
   ```bash
   pip install pandas openpyxl
Script Description
The script reads player data from a JSON string, processes the data to balance the teams, and outputs the results to the console and an optional Excel file.

Player Data
The player data includes the following attributes for each player:

Name: The name of the player.
Stamina, Dribbling, ShotPower, Passing, Accuracy, Defense: Various skill metrics for the player.
Playing: Whether the player is currently playing (true or false).
PrimaryRole: The primary role of the player (MID, DEF, GK, WS).
SecondaryRole: The secondary role of the player (MID, DEF, GK, WS).
How to Use
Replace the sample JSON data in the players_json variable with your actual player data.

Run the script using Python:

python Team-Balance.py
The script will output the balanced teams to the console and save them to an Excel file named Team_Distribution.xlsx (if the openpyxl library is installed).

Example Output

Green Team:
Chirag
Jaiswal
Nasiq
harsha
ketan
Sanjay
Sudeep
abhijit
Deepak

Orange Team:
Jithu
Dnyanesh
Amritpal
dheeraj
Vamshi
nuhu
Kartik
harsH
shailesh
Vishnu


Customization
You can adjust the balancing logic by modifying the distribute_players function and other parts of the script to suit your specific needs.

Contributing
If you have any suggestions or improvements, feel free to submit a pull request or open an issue.






