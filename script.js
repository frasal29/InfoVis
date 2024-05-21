// script.js

// Seleziona l'elemento SVG nel file HTML
var svg = d3.select("#stacked-bar-chart");

// Carica i dati dal file dati.json
d3.json('dati.json').then(function(data) {
    // Definisci le variabili chiave (escludendo 'id')
    var keys = Object.keys(data[0]).slice(1);

    // Definisci le dimensioni del grafico e il margine
    var margin = { top: 40, right: 100, bottom: 60, left: 60 }; // Margini più ampi per migliorare la leggibilità
    var width = 900 - margin.left - margin.right; // Aumenta la larghezza del grafico
    var height = 500 - margin.top - margin.bottom; // Aumenta l'altezza del grafico

    // Crea le scale per gli assi x e y
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.id; }))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d3.sum(keys, function(key) { return d[key]; }); })])
        .nice()
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeSet3); // Utilizza la palette di colori d3.schemeSet3

    // Crea lo SVG
    var chart = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Crea le barre impilate
    var stack = d3.stack().keys(keys)(data);

    var bars = chart.selectAll("g.layer")
        .data(stack)
        .enter().append("g")
        .attr("class", "layer")
        .attr("fill", function(d) { return color(d.key); });

    bars.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.id); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        .on("click", handleClick);
    
        // Aggiungi assi x e y
    chart.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.bottom / 2)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text("Data-Case");

    chart.append("g")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Value");

    // Aggiungi legenda
    var legend = chart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12) // Aumenta la dimensione del testo della legenda per migliorare la leggibilità
        .attr("text-anchor", "end")
        .attr("transform", "translate(" + (width + margin.right - 20) + ",0)"); // Trasla la leggenda a destra

    legend.selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        .each(function(d) {
            var group = d3.select(this);
            group.append("rect")
                .attr("x", 0)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", color(d));

            group.append("text")
                .attr("x", -5)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(d);
        });

    // Gestisci il click per scambiare le sezioni delle barre
    function handleClick(event, d) {
        // Verifica che il click sia avvenuto con il pulsante sinistro del mouse
        if (event.button !== 0) return;

        var clickedKey = d3.select(this.parentNode).datum().key;
        var clickedIndex = keys.indexOf(clickedKey);
        var secondKey = keys[(clickedIndex + 1) % keys.length];
        // Controlla se la variabile cliccata è l'ultima nell'array delle chiavi
        if (clickedIndex === keys.length -1) return;

        // Scambia i valori tra le sezioni cliccate e quelle immediatamente superiori
        data.forEach(function(d) {
            var temp = d[clickedKey];
            d[clickedKey] = d[secondKey];
            d[secondKey] = temp;
        });

        // Aggiorna i colori nella scala
        var colors = color.range();
        var tempColor = colors[clickedIndex];
        colors[clickedIndex] = colors[(clickedIndex + 1) % colors.length];
        colors[(clickedIndex + 1) % colors.length] = tempColor;
        color.range(colors);

        // Aggiorna il grafico con transizioni fluide
        var updatedStack = d3.stack().keys(keys)(data);

        bars.data(updatedStack)
            .selectAll("rect")
            .data(function(d) { return d; })
            .transition()
            .duration(750)
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("fill", function(d) {
                var key = d3.select(this.parentNode).datum().key;
                return color(key);
            });

    }


});
