# Demo

A demo of the stacked bar chart visualization can be found [here](https://frasal29.github.io/InfoVis/).


# Stacked Bar Chart with D3.js

This project demonstrates how to create a stacked bar chart using D3.js (version 7). The chart is created dynamically from data loaded from a JSON file. Additionally, the project includes a Node.js server script to serve the HTML, JavaScript, and JSON files.

## Installation

1. Clone the repository:

    ```bash
    git clone <https://github.com/frasal29/InfoVis.git>
    ```

2. Navigate to the project directory:

    ```bash
    cd stacked-bar-chart-d3
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the Node.js server "server.js":

    ```bash
    npm start
    ```

2. Open a web browser and go to [http://localhost:3000](http://localhost:3000) to view the stacked bar chart.


## File Structure

- `script.js`: JavaScript file containing the D3.js code to create the stacked bar chart.
- `index.html`: HTML file containing the SVG element to render the chart and the script tag to include `script.js`.
- `dati.json`: JSON file containing the data for the stacked bar chart.
- `server.js`: Node.js server script to serve HTML, JavaScript, and JSON files.

## Dependencies

- [D3.js](https://d3js.org/): A JavaScript library for manipulating documents based on data.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
