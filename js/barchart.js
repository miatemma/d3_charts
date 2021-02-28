// read in the data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((d) => {
  var data = [];
  var gdp = d.data.map((el) => el[1]);
  d.data.forEach((el) => data.push({ date: el[0], gdp: el[1] }));

  var width = 800,
    height = 400,
    barWidth = width / 275;

  var tooltip = d3
    .select("#visHolder-1")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  var svgContainer = d3
    .select("#visHolder-1")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height + 60);

  svgContainer
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -350)
    .attr("y", 20)
    .text("Gross Domestic Product [B. USD]");

  svgContainer
    .append("text")
    .attr("x", width / 2 - 200)
    .attr("y", height + 50)
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
    .attr("class", "info");

  const yscale = d3
    .scaleLinear()
    .domain([0, d3.max(gdp) * 1.1])
    .range([0, height]);
  var scaledGDP = data.map((el) => yscale(el.gdp));

  const yscale_reverse = d3
    .scaleLinear()
    .domain([0, d3.max(gdp) * 1.1])
    .range([height, 0]);
  var y_axis = d3.axisLeft(yscale_reverse);

  var yearsDate = data.map((el) => new Date(el.date));
  var xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);
  var xscale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([0, width]);

  var x_axis = d3.axisBottom(xscale);
  var scaledDate = data.map((el) => xscale(new Date(el.date)));

  svgContainer
    .append("g")
    .call(x_axis)
    .attr("id", "x-axis")
    .attr("transform", "translate(80, 400)");

  svgContainer
    .append("g")
    .call(y_axis)
    .attr("id", "y-axis")
    .attr("transform", "translate(80, 0)");

  var barwidth = width / 275;

  d3.select("svg")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => d.date)
    .attr("data-gdp", (d, i) => d.gdp)
    .attr("x", (d, i) => scaledDate[i])
    .attr("y", (d, i) => height - scaledGDP[i])
    .attr("width", barwidth)
    .attr("height", (d, i) => scaledGDP[i])
    .attr("fill", "blue")
    .attr("class", "bar")
    .attr("transform", "translate(80, 0)")
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .attr("data-date", d.date)
        .html(formatText(d.date) + "<br>" + d.gdp + " USD")
        .style("left", event.layerX + 30 + "px")
        .style("top", event.layerY + 30 + "px");
      d3.select(this).style("fill", "lightblue");
    })

    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      d3.select(this).style("fill", "blue");
    });
});

function formatText(str) {
  arr = str.split('-');
  switch (arr[1]) {
    case "01": case "02": case "03":
      return (arr[0] + ", Q1");
      break;
    case "04": case "05": case "06":
      return (arr[0] + ", Q2");
      break;
    case "07": case "08": case "09":
      return (arr[0] + ", Q3");
      break;
    case "10": case "11": case "12":
      return (arr[0] + ", Q4");
    default:
      break;
    }

  }
