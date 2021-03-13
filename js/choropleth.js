
var countyData = [];
var educationData = [];
var promises = [];

var width = 1000;
var height = 750;


var colors = ["#00FFCC", "#00CCCC", "#0099CC", "#0066CC", "#0033CC", "#0000CC"];
var scale = [];
var maxData;
var minData;
var diff;


var svgContainer = d3
  .select("#visHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 100);

var tooltip = d3
  .select("#visHolder")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);


var files = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
];

files.forEach(function (url) {
  promises.push(d3.json(url))
});

Promise.all(promises).then(function (values) {
  countyData = values[0];
  educationData = values[1];
  createGraph();
});


function createGraph() {

  /* Calculate scale */
  var eduData = educationData.map(el => el.bachelorsOrHigher);
  maxData = d3.max(eduData);
  minData = d3.min(eduData);
  diff = (maxData - minData) / colors.length;
  scale = colors.map((el, i) => (minData + i * diff));

  svgContainer.selectAll("path")
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => (getEducationData(d).bachelorsOrHigher))
    .attr("fill", (d) => getColor(d))

    .on("mouseover", function (event, d) {
      let dataset = getEducationData(d);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .attr("data-education", getEducationData(d).bachelorsOrHigher)
        .attr("id", "tooltip")
        .html(dataset.bachelorsOrHigher + "% <br>" + dataset.state + " " + dataset.area_name)
        .style("left", event.layerX + 30 + "px")
        .style("top", event.layerY + 30 + "px")
      d3.select(this).style("fill", "#FF0033");
    })

    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).style("fill", (d) => getColor(d))
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
    .attr("y", height - 85)
    .attr("width", 45)
    .attr("height", 20)
    .style("fill", (d) => d);
  legend
    .append("text")
    .attr("x", (d, i) => 100 + 45 * i)
    .attr("y", height - 50)
    .attr("font-size", "10px")
    .text((d, i) => (scale[i].toFixed(1) + "%"));

}

function getColor(d) {

  var val = getEducationData(d).bachelorsOrHigher;
  var colorIdx = Math.floor((val - minData) / diff);
  if (colorIdx > 5) colorIdx = 5;
  return (colors[colorIdx]);
}

function getEducationData(d) {
  var data = educationData.find(el => el.fips === d.id);
  if (data)
    return data;
  else
    return 0;
}
