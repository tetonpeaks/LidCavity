#!/bin/bash

# Function to kill process by name
kill_process_by_name() {
    local process_name="$1"
    local pid=$(pgrep -f "$process_name")

    if [ -z "$pid" ]; then
        echo "No process with the name '$process_name' found."
    else
        kill -9 "$pid"
        echo "Process '$process_name' with PID $pid killed successfully."
    fi
}

# Check if argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <process_name>"
    exit 1
fi

process_name="$1"

# Call function to kill process by name
kill_process_by_name "$process_name"
