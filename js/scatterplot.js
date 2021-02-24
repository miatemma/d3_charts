var data = [];
var width = 1000;
var height = 500;
var margin = 50;

var time = [];
var year = [];

var svg = d3
  .select("#scatterplot")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Doping in Professional Bicycle Racing")

    // read in the data
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    ).then((d) => {
      console.log(d);
      time = d.map( el => el.Time );
      year = d.map( el => el.Year );
      console.log(time);
      console.log(year);
      createGraph();
    });

    function createGraph() {

      console.log(new Date(time[0]));

      /*
      const yscale = d3
        .scaleTime()
        .domain([d3.min(time), d3.max(time)])
        .range([0, height-margin ]);
      const yscale_reverse = d3
        .scaleLinear()
        .domain([0, d3.max(gdp)])
        .range([height - margin, margin]);
      var y_axis = d3.axisLeft().scale(yscale_reverse);
      */

      const xscale = d3
        .scaleLinear()
        .domain([d3.min(year), d3.max(year)])
        .range([margin, width - margin]);
      var x_axis = d3.axisBottom().scale(xscale);


    }
