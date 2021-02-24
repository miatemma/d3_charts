var data = [];
var width = 1000;
var height = 500;
var margin = 50;

var gdp = [];

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")

// read in the data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((d) => {
  gdp = d.data.map((el) => el[1]);
  d.data.forEach((el) => data.push({ date: el[0], gdp: el[1] }));
  console.log(data);
  createGraph();
});

function createGraph() {
  const yscale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([0, height-margin ]);
  const yscale_reverse = d3
    .scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([height - margin, margin]);
  var y_axis = d3.axisLeft().scale(yscale_reverse);

  const xscale = d3
    .scaleTime()
    .domain([new Date(data[0].date), new Date(data[data.length - 1].date)])
    .range([margin, width - margin]);
  var x_axis = d3.axisBottom().scale(xscale);

  var scaledDate = data.map((el) => xscale(new Date(el.date)));
  var scaledGDP = data.map((el) => yscale(el.gdp));


  svg
    .append("g")
    .attr("transform", "translate(" + margin + ", 0)")
    .attr("id", "y-axis")
    .call(y_axis);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate( 0, " + (height - margin) + ")")
    .call(x_axis);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("United States GDP, 1947-2015");

  var g = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "bar");

  var barwidth = (width - 2 * margin) / 275;
  console.log(barwidth);

  g.append("rect")
    .attr("data-date", (d, i) => d.date)
    .attr("data-gdp", (d, i) => d.gdp)
    .attr("x", (d, i) => scaledDate[i])
    .attr("y", (d, i) => height - scaledGDP[i] - margin)
    .attr("width", barwidth)
    .attr("height", (d, i) => scaledGDP[i] )
    .attr("fill", "blue")
    .attr("class", "bar")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .attr("data-date", d.date)
        .html(d.date + "<br>" + d.gdp + " USD")
        .style("left", event.pageX + "px")
        .style("top", event.pageY + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}
