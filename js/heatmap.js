var width = 800;
var height = 400;
var colors = ["#333dff", "#33caff", "#33fffe", "#FFfa00", "#FFbe00", "#FF8c00", "#FF5a00", "#FF1e00", "#af0000"];
var tempScale = [];

var tooltip = d3
  .select("#visHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var svgContainer = d3
  .select("#visHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 100);

// read in the data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then((data) => {

  var globalData = new Array(12);

  var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  data.monthlyVariance.forEach((el) => {
    let i = el.month;
    if (!globalData[i - 1]) (globalData[i - 1] = []);
    globalData[i - 1].push({ year: el.year, temp: 8.66 + el.variance });
  });

  var temp = data.monthlyVariance.map(el => (el.variance + 8.66));
  var tempMin = d3.min(temp);
  var tempMax = d3.max(temp);
  var diff = (tempMax - tempMin) / colors.length;
  tempscale = colors.map((el, i) => (tempMin + i * diff));
  console.log(tempscale);

  var len = globalData[0].length;

  const yScale = d3
    .scaleBand()
    .domain(monthArr)
    .range([height, 0]);

  const y_axis = d3.axisLeft(yScale);

  svgContainer
    .append("g")
    .call(y_axis)
    .attr("id", "y-axis")
    .attr("transform", "translate(80, 20)");


  const xscale = d3
    .scaleLinear()
    .domain([globalData[0][0].year, globalData[0][len - 1].year + 1])
    .range([0, width]);
  var x_axis = d3.axisBottom(xscale).tickFormat(d3.format("d"));

  svgContainer
    .append("g")
    .call(x_axis)
    .attr("id", "x-axis")
    .attr("transform", "translate(80, 420)");


  var cellHeight = height / 12;
  var cellWidth = width / (globalData[0][len - 1].year - globalData[0][0].year);

  d3.select("svg")
    .selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d, i) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => 8.66 + d.variance)
    .attr("x", (d) => xscale(d.year))
    .attr("y", (d) => height - cellHeight * d.month)
    .attr("width", cellWidth)
    .attr("height", cellHeight)
    .attr("fill", (d) => getColor(d.variance + 8.66))
    .attr("transform", "translate(80, 20)")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .attr("data-year", d.year)
        .attr("data-temp", d.variance + 8.66)
        .attr("data-month", d.month - 1)
        .html(d.year + ", " + monthArr[d.month] + ": <br>"
          + (d.variance + 8.66).toFixed(2) + " °C, &Delta;"
          + (d.variance).toFixed(2) + " °C")
        .style("left", event.layerX + 30 + "px")
        .style("top", event.layerY + 30 + "px");
    })

    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  var legendContainer = d3.select("svg")
    .append("g")
    .attr("id", "legend")

  var legend = legendContainer
    .selectAll("#legend")
    .data(colors)
    .enter()
    .append("g")
    .attr("class", "legend-label")
  legend
    .append("rect")
    .attr("x", (d, i) => 100 + 45 * i)
    .attr("y", height + 50)
    .attr("width", 45)
    .attr("height", 10)
    .style("fill", (d) => d);
  legend
    .append("text")
    .attr("x", (d, i) => 100 + 45 * i)
    .attr("y", height + 70)
    .attr("font-size", "10px")
    .text((d, i) => (tempscale[i]).toFixed(1) + "°C");

  function getColor(temp) {
    var colorIdx = Math.floor((temp - tempMin) / diff);
    if (colorIdx > 8) colorIdx = 8;
    return (colors[colorIdx]);
  }


});
