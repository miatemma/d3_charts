var width = 800;
var height = 400;

var colors = ["#FE2712", "#FC600A", "#FB9902", "#FCCC1A", "#FEFE33", "#B2D732", "#66B032", "#347C98", "#0247FE",
  "#4424D6", "#8601AF", "#C21460", "#00FFFF", "#a2b9bc", "#b2ad7f", "#3e4444", "#f7786b", "#fefbd8"];

var datasets = [];


var promises = [];
var scale = [];
var maxData;
var minData;
var diff;



var files = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
];

files.forEach(function (url) {
  promises.push(d3.json(url))
});

Promise.all(promises).then(function (values) {
  datasets[0] = values[0];
  datasets[1] = values[1];
  datasets[2] = values[2];
  createGraph(datasets[0]);
});


//radio button to redraw data
d3.selectAll(("input[name='dataset']")).on("change", function () {
  document.getElementById("visHolder").innerHTML = "";
  createGraph(datasets[this.value]);
});



function createGraph(data) {

  var svgContainer = d3
    .select("#visHolder")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height + 300);

  var tooltip = d3
    .select("#visHolder")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);


  var categories = data.children.map(el => el.name);

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .padding(2)
    (root)

  var cells = svgContainer
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("class", "group")

  // use this information to add rectangles:
  cells
    .append("rect")
    .attr("class", "tile")
    .attr("data-category", d => d.data.category)
    .attr("data-name", d => d.data.name)
    .attr("data-value", d => d.data.value)
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("fill", (d, i) => getColor(d, categories))
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .attr("data-category", d.data.category)
        .attr("data-value", d.data.value)
        .attr("id", "tooltip")
        .html("<strong>" + d.data.name + "</strong><br>" + Number(d.data.value).toLocaleString() + " USD <br> Category: " + d.data.category)
        .style("left", event.layerX + 30 + "px")
        .style("top", event.layerY + 30 + "px")
      d3.select(this).style("fill", "#000");
    })

    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).style("fill", (d) => getColor(d, categories))
    });

  console.log(data);

  cells
    .append("text")
    .attr("class", "description")
    .attr("text-anchor", "left")
    .attr("font-size", "8px")
    .style('fill', 'black')
    .attr("x", function (d) { return d.x0 + 2; })
    .attr("y", function (d) { return d.y0 + 10; })
    .text((d) => getText(d.data.value));

  cells
    .append("text")
    .attr("class", "description")
    .attr("text-anchor", "left")
    .attr("font-size", "8px")
    .style('fill', 'black')
    .attr("x", function (d) { return d.x0 + 2; })
    .attr("y", function (d) { return d.y0 + 20; })
    .text((d) => getText2(d.data.value));


  var legendContainer = d3.select("svg")
    .append("g")
    .attr("id", "legend")

  var legend = legendContainer
    .selectAll("#legend")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "legend-label")
  legend
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", (d, i) => 10 + 150 * (i % 5))
    .attr("y", (d, i) => height + 40 + 40 * Math.floor(i / 5))
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", (d, i) => (colors[i]));
  legend
    .append("text")
    .attr("x", (d, i) => 40 + 150 * (i % 5))
    .attr("y", (d, i) => height + 55 + 40 * Math.floor(i / 5))
    .attr("font-size", "10px")
    .text((d, i) => d);
}

function getColor(d, categories) {
  var i = categories.indexOf(d.data.category);
  return colors[i];
}

function getText(value) {
  // greater than 10 Mio.
  if (value > 10000000) {
    return (value / 1000000).toFixed(0);
  }
  // greater than 1 Mio.
  if (value > 1000000) {
    return (value / 1000000).toFixed(1);
  }
  return value;
}

function getText2(value) {
  // greater than 1 Mio.
  if (value > 1000000) {
    return " M$";
  }
  else  
    return "";
}


