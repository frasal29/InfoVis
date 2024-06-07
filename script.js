// script.js

// Select the SVG element in the HTML file
var svg = d3.select("#stacked-bar-chart");

// Load data from dati.json file
d3.json('dati.json').then(function(data) {
    // Define key variables (excluding 'id')
    var keys = Object.keys(data[0]).slice(1);

    // Define chart dimensions and margin
    var margin = { top: 40, right: 100, bottom: 60, left: 60 }; // Wider margins for better readability
    var width = 900 - margin.left - margin.right; // Increase chart width
    var height = 500 - margin.top - margin.bottom; // Increase chart height

    // Create scales for x and y axes
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.id; })) // Set domain to data IDs
        .range([0, width]) // Set range to chart width
        .padding(0.1); // Add padding between bars

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d3.sum(keys, function(key) { return d[key]; }); })]) // Set domain to max sum of data values
        .nice() // Round up the domain
        .range([height, 0]); // Set range to chart height (inverted)

    // Define ordinal color scale with specific shades of blue
    var colors = ["#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"]; // Customize colors
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(colors);

    // Create the SVG
    var chart = svg
        .attr("width", width + margin.left + margin.right) // Set SVG width
        .attr("height", height + margin.top + margin.bottom) // Set SVG height
        .append("g") // Append a group element
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Translate group by margins

    // Create stacked bars
    var stack = d3.stack().keys(keys)(data);

    // Create a group for each series
    var bars = chart.selectAll("g.layer")
        .data(stack) // Bind data to groups
        .enter().append("g") // Create group for each series
        .attr("class", "layer") // Add class 'layer' to each group
        .attr("fill", function(d) { return color(d.key); }); // Set fill color for each group

    // Append rectangles (bars) to each group
    bars.selectAll("rect")
        .data(function(d) { return d; }) // Bind data to rectangles
        .enter().append("rect") // Create rectangles
        .attr("x", function(d) { return x(d.data.id); }) // Set x position
        .attr("y", function(d) { return y(d[1]); }) // Set y position (top of the bar)
        .attr("height", function(d) { return y(d[0]) - y(d[1]); }) // Set height of the bar
        .attr("width", x.bandwidth()) // Set width of the bar
        .on("click", handleClick); // Add click event handler
    
    // Add x and y axes
    chart.append("g")
        .attr("transform", "translate(0," + height + ")") // Position x axis at the bottom
        .call(d3.axisBottom(x)) // Create x axis
        .append("text") // Append text label
        .attr("x", width / 2) // Position label in the center
        .attr("y", margin.bottom / 2) // Position label below the axis
        .attr("fill", "#000") // Set text color
        .attr("font-weight", "bold") // Set text weight
        .attr("text-anchor", "middle") // Center align the text
        .text("Data-Case"); // Set text

    chart.append("g")
        .call(d3.axisLeft(y).ticks(null, "s")) // Create y axis with default ticks
        .append("text") // Append text label
        .attr("x", 2) // Position label near the axis
        .attr("y", y(y.ticks().pop()) + 0.5) // Position label at the top
        .attr("dy", "0.32em") // Set y offset
        .attr("fill", "#000") // Set text color
        .attr("font-weight", "bold") // Set text weight
        .attr("text-anchor", "start") // Left align the text
        .text("Value"); // Set text

    // Add legend
    var legend = chart.append("g")
        .attr("font-family", "sans-serif") // Set font family
        .attr("font-size", 12) // Increase legend text size for better readability
        .attr("text-anchor", "end") // Right align the text
        .attr("transform", "translate(" + (width + margin.right - 20) + ",0)"); // Translate legend to the right

    // Create legend entries
    legend.selectAll("g")
        .data(keys.slice().reverse()) // Reverse keys for legend order
        .enter().append("g") // Create group for each legend entry
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; }) // Position each entry
        .each(function(d) {
            var group = d3.select(this);
            group.append("rect") // Append colored rectangle
                .attr("x", 0)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", color(d));

            group.append("text") // Append text label
                .attr("x", -5) // Position text to the left of the rectangle
                .attr("y", 9.5) // Center text vertically
                .attr("dy", "0.32em") // Set y offset
                .text(d); // Set text
        });

    // Handle click to swap sections of bars
    function handleClick(event, d) {
        // Check if click is with the left mouse button
        if (event.button !== 0) return;

        var clickedKey = d3.select(this.parentNode).datum().key; // Get key of clicked bar section
        var clickedIndex = keys.indexOf(clickedKey); // Get index of clicked key
        var secondKey = keys[(clickedIndex + 1) % keys.length]; // Get next key in the array
        // Check if clicked variable is the last in the keys array
        if (clickedIndex === keys.length - 1) return;

        // Swap values between clicked and immediately higher sections
        data.forEach(function(d) {
            var temp = d[clickedKey];
            d[clickedKey] = d[secondKey];
            d[secondKey] = temp;
        });

        // Update colors in the scale
        var colors = color.range(); // Get current color range
        var tempColor = colors[clickedIndex]; // Swap colors in the range
        colors[clickedIndex] = colors[(clickedIndex + 1) % colors.length];
        colors[(clickedIndex + 1) % colors.length] = tempColor;
        color.range(colors); // Set updated color range

        // Update chart with smooth transitions
        var updatedStack = d3.stack().keys(keys)(data); // Get updated stack

        bars.data(updatedStack) // Bind updated stack to bars
            .selectAll("rect")
            .data(function(d) { return d; }) // Bind data to rectangles
            .transition() // Add transition for smooth update
            .duration(750) // Set duration of transition
            .attr("y", function(d) { return y(d[1]); }) // Update y position
            .attr("height", function(d) { return y(d[0]) - y(d[1]); }) // Update height
            .attr("fill", function(d) { // Update fill color
                var key = d3.select(this.parentNode).datum().key;
                return color(key);
            });
        }
});