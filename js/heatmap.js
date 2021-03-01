var width = 800;
var height = 400;

var tooltip = d3
  .select("#visHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var svgContainer = d3
  .select("#visHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 60);

svgContainer
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -350)
  .attr("y", 20)
  .text("months");

// read in the data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then((data) => {

  console.log(data);
  var globalData = new Array(12);
  console.log(globalData);

  data.monthlyVariance.forEach( (el) => {
    let i = el.month;
    if (!globalData[i-1]) (globalData[i-1] = []);
    globalData[i-1].push({ year: el.year, temp: 8.66 + el.variance });
  });

  console.log(globalData);

  /*
  const xscale = d3
    .scaleLinear()
    .domain([d3.min(year) - 1, d3.max(year) + 1])
    .range([0, width]);
  var x_axis = d3.axisBottom(xscale).tickFormat(d3.format("d"));

  var yscale = d3
    .scaleTime()
    .domain([d3.min(time), d3.max(time)])
    .range([0, height]);
  var y_axis = d3.axisLeft(yscale).tickFormat(d3.timeFormat("%M:%S"));

  svgContainer
    .append("g")
    .call(x_axis)
    .attr("id", "x-axis")
    .attr("transform", "translate(80, 420)");

  svgContainer
    .append("g")
    .call(y_axis)
    .attr("id", "y-axis")
    .attr("transform", "translate(80, 20)");

  d3.select("svg")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .attr("cx", (d) => xscale(d.Year))
    .attr("cy", (d) => yscale(d.Time))
    .attr("r", 10)
    .attr("fill", (d) => d.Color)
    .attr("transform", "translate(80, 20)")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .attr("data-year", d.Year)
        .attr("data-time", d.Time)
        .html(d.Name + "<br>" + d.Year + "<br>" + d.Time0)
        .style("left", event.layerX + 30 + "px")
        .style("top", event.layerY + 30 + "px");
      d3.select(this).style("fill", "lightblue");
    })

    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).style("fill", (d) => d.Color);
    });

  var legendContainer = d3.select("svg")
    .append("g")
    .attr("id", "legend")
    .attr("border", "1px solid grey");

  var legend = legendContainer
    .selectAll("#legend")
    .data(["orange", "green"])
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", function (d, i) {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });
  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => d);
  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => {
      if (d == "orange") return "Riders with doping allegations";
      else return "Riders with no doping allegations";
    });
    */
});
