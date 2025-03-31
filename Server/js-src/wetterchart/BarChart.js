export function BarChart(data, options) {
    const config = {
        ...options
    }
    
    let x = get_x_scale()

    const y = d3.scaleLinear()
    .domain([0, d3.max(maxVal, function(d) {
      return d;
    })])
    .range([height, 0]);

    const svg = d3.select(config.container).append('svg')
    .attr('class', 'wetterchart')
    .attr('width', w)
    .attr('height', h);

    let chart = svg.append('g')
    .classed('graph', true)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let layersArea = chart.append('g')
    .attr('class', 'layers');


    const layers = layersArea.append('g')
    .attr('class', 'layer');

    layers.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('height', function(d, i) {
        return height - y(d.one);
    })
    .attr('y', function(d, i) {
      return y(d.one);
    })
    .attr("width", function(d) {
      return x(d3.timeDay.offset(d.date, 10)) - x(d.date)
    })
    .attr('x', function(d, i) {
        return x(d3.timeDay.offset(d.date, -5));
    })
    .style('fill', (d, i) => {
        return colors[i];
    });

    chart.append('g')
    .classed('x axis', true)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
        .tickValues(data.map(function(d) {
            return new Date(d.date)
        }))
    );

    chart.append('g')
    .classed('y axis', true)
    .call(d3.axisLeft(y).ticks(10));

    function calcWidth() { return config.width - config.margin.left - config.margin.right }
    function calcHeight() { return config.height - config.margin.bottom - config.margin.top }

    function get_y_scale(data, y_value) {
        return d3.scaleLinear()
            .range([height, 0])
            .domain(config.axis.y.domain(data, y_value))
    }
    
    function get_x_scale(data) {
        return d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, d => d[config.x]))
    }
}