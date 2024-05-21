## CLI React App with Next.js

This project implements a user-friendly command-line interface (CLI) application built upon the powerful Next.js framework. It empowers users to interact with the app through text commands, offering functionalities like:

* **Fetching Cryptocurrency Prices**: Obtain the current price of a specified cryptocurrency in real-time.
* **Uploading CSV Files**: Seamlessly upload CSV files for further processing and analysis.
* **Generating Data Visualizations**: Create charts from uploaded CSV data, visualizing trends and insights.
* **File Deletion Management**: Effortlessly delete uploaded CSV files when they're no longer needed.
* **Command History Clearing**: Maintain a clean slate by clearing the command history for a fresh start.

## Getting Started

# Prerequisites:

* **Node.js and npm (or yarn):** Ensure you have Node.js (version 14.0.0 or later) and its package manager (npm or yarn) installed on your system. Download them from: https://nodejs.org/en/

## Installation

1. **Clone the Repository:**

```bash
   git clone https://github.com/ShaniDevelp/CLI_APP.git
```

2. **Install Dependencies:**

```bash
   cd CLI_APP 
   npm install
```
(or yarn install)

3. **Run the Development Server:**

```bash
   npm run dev
```
This will start the development server on port 3000 by default. You can access the app in your browser at (http://localhost:3000/).

## Using the App:

The app starts with a welcome message. You can interact with it by typing commands in the input field. Press Enter to submit the command.

## Available Commands:

* **help**: Displays a list of available commands.
* **about**: Provides information about the CLI app.
* **fetch-price [coin]**: Fetches the current price of a specified cryptocurrency (e.g., fetch-price BTCUSDT).
* **upload**: Uploads a CSV file.
* **draw [file] [columns]**: Draws a chart from the specified columns of the uploaded file (e.g., draw my_data.csv "Date" "Price").
* **delete [file]**: Deletes the uploaded file (e.g., delete my_data.csv).
* **clear**: Clears the command history.

## Notes:

* For the **draw** command, ensure the uploaded CSV file has a header row with column names matching the specified columns.
* The **fetch-price** command requires an internet connection.
