#!/bin/bash

# Function to kill processes by port
kill_processes_by_port() {
    local port="$1"
    local pids=($(lsof -ti :"$port"))

    if [ ${#pids[@]} -eq 0 ]; then
        echo "No processes found on port $port."
    else
        for pid in "${pids[@]}"; do
            kill -9 "$pid"
            echo "Process with PID $pid killed successfully."
        done
    fi
}

# Check if argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <port_number>"
    exit 1
fi

port_number="$1"

# Call function to kill processes by port number
kill_processes_by_port "$port_number"
