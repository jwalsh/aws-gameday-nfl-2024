import pandas as pd
import json
from pathlib import Path


def explore_players():
    """Analyze players.csv data"""
    players_file = Path("data/analytics/players/players.csv")
    if players_file.exists():
        df = pd.read_csv(players_file)
        print("\n=== Players Data Analysis ===")
        print(f"Total Players: {len(df)}")
        print("\nColumns:")
        for col in df.columns:
            print(f"- {col}")
        print("\nSample Data:")
        print(df.head())
        print("\nSummary Statistics:")
        print(df.describe())
        return df
    return None


def explore_bootstrap_logs():
    """Read and analyze bootstrap logs"""
    log_path = Path(
        "data/quest-logs/bootstrap/721d860f-7b68-46e0-87e4-a8a30a2d95a7/i-0f5d07bdd7515e96b/awsrunShellScript"
    )

    print("\n=== Bootstrap Process Analysis ===")
    for step_dir in log_path.iterdir():
        if step_dir.is_dir():
            print(f"\nStep: {step_dir.name}")
            stdout_file = step_dir / "stdout"
            if stdout_file.exists():
                print(f"Output: {stdout_file.read_text()[:200]}...")  # First 200 chars


def main():
    print("AWS GameDay Data Explorer")
    print("========================")

    # Load sync info
    with open("data/sync-info.json") as f:
        sync_info = json.load(f)
        print(f"Last Sync: {sync_info['last_sync']}")
        print(f"Team Number: {sync_info['team_number']}")

    # Explore players data
    df = explore_players()

    # Explore bootstrap logs
    explore_bootstrap_logs()

    return df  # Return dataframe for interactive use


if __name__ == "__main__":
    df = main()
