var countyData = [];
var educationData = [];
var promises = [];

var width = 1200;
var height = 800;

var svgContainer = d3
  .select("#visHolder")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 100);


var files = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
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

  var projection = d3.geoAlbersUsa()
    .scale(200)
    .translate([width / 2, height / 2]);

  var path = d3.geoPath().projection(projection);

  svgContainer.selectAll("path")
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())

}