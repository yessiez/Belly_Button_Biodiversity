function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
   
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleDataArray = samples.filter(obj => (obj.id == sample));

    //  5. Create a variable that holds the first sample in the array.
    var sampleData = sampleDataArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleData.otu_ids;
    var otuLabels = sampleData.otu_labels;
    var sampleValues = sampleData.sample_values;

    console.log(otuIds)
    console.log(otuLabels)
    console.log(sampleValues)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var valTicks = sampleValues.slice(0,10).reverse();
    var idTicks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var labTicks = otuLabels.slice(0, 10);
   
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: valTicks,
      y: idTicks,
      type: "bar",
      orientation: "h",
    
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"

    };
    // 10. Use Plotly to plot the data with the layout. 
    //Plotly.newPlot("bar", barData, barLayout)

    // Deliverable 2

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: idTicks,
      y: valTicks,
      text: labTicks,
      mode: "markers",
      marker: {
        size: valTicks,
        color: otuIds.slice(0,10).reverse(),
        colorscale: "Electric",
      },
      type: "scatter",
      
      //text: labTicks,
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      //width:800,
      //height:400,
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)',
      margin: { t: 0 },
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: {
          text: "OTU ID",
        },
      yaxis: { range: 250},
      hovermode:'closest',
      },

    };

    
    // 3. Create a variable that holds the washing frequency.
    var washFrequency = data.metadata.filter(obj => (obj.id == sample))[0].wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 2], y: [0, 2] },
        value: washFrequency,
        title: { text: "Wash Per Week" },
        font:{
          color: "black",
          size: 12,
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"},
          ],
          axis: {range: [0, 10],
            tickwidth: 1,
            tickcolor: "white"},
            bar: {color: "black"},
          }  

        
        }];
        
  
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      font:{ color: "black", size: 14},
      margin: { t:0, b:0},
    }

    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot("bar", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Use Plotly to plot the guage data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  });
}
