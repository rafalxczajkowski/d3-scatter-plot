document.addEventListener('DOMContentLoaded', function () {
  d3.select('body').append('div').attr('id', 'tooltip')

  fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  )
    .then((response) => response.json())
    .then((data) => {
      const w = 1000
      const h = 750
      const padding = 60
      const color_pos = 'orange'
      const color_neg = 'darkorchid'
      const legend_square_size = 13

      const minX = d3.min(data, (d) => d.Year) - 1
      const maxX = d3.max(data, (d) => d.Year)
      const minY = d3.min(
        data,
        (d) => new Date('2000-01-01T00:' + d.Time + 'Z')
      )
      const maxY = d3.max(
        data,
        (d) => new Date('2000-01-01T00:' + d.Time + 'Z')
      )
      const xScale = d3
        .scaleLinear()
        .domain([minX, maxX])
        .range([padding, w - padding])

      const yScale = d3
        .scaleTime()
        .domain([maxY, minY])
        .range([h - padding, padding])

      const svgArea = d3
        .select('.chartcontainer')
        .append('svg')
        .attr('width', w)
        .attr('height', h)

      svgArea
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => xScale(d.Year))
        .attr('cy', (d) => yScale(new Date('2000-01-01T00:' + d.Time + 'Z')))
        .attr('data-xvalue', (d) => d.Year)
        .attr('data-yvalue', (d) => new Date('2000-01-01T00:' + d.Time + 'Z'))
        .attr('r', 7)
        .attr('fill', (d) => (d.Doping == '' ? color_neg : color_pos))
        .on('mouseover', function (e, d) {
          d3.select('#tooltip')
            .html(tooltip_info_str(d))
            .attr('data-year', d.Year)
            .transition()
            .duration(200)
            .style('opacity', 0.9)
        })
        .on('mouseout', (e) => {
          d3.select('#tooltip').transition().duration(200).style('opacity', 0)
        })
        .on('mousemove', (e) => {
          d3.select('#tooltip')
            .style('left', e.pageX + 10 + 'px')
            .style('top', e.pageY + 10 + 'px')
        })

      //title
      svgArea
        .append('text')
        .text('Doping in Professional Bicycle Racing')
        .attr('x', w * 0.33)
        .attr('y', h * 0.1)
        .attr('id', 'title')

      //subtitle
      svgArea
        .append('text')
        .text("35 Fastest times up Alpe d'Huez")
        .attr('x', w * 0.37)
        .attr('y', h * 0.13)
        .attr('id', 'subtitle')

      //y axis label
      svgArea
        .append('text')
        .text('Time in Minutes and Seconds')
        .attr('transform', 'rotate(-90)')
        .attr('x', -460)
        .attr('y', 20)

      //legend
      let legend = svgArea
        .append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate(650,300)')
      legend
        .append('rect')
        .style('fill', color_pos)
        .attr('width', legend_square_size)
        .attr('height', legend_square_size)
        .attr('y', 0)
      legend
        .append('text')
        .text('Riders with doping allegations')
        .attr('x', 25)
        .attr('y', 12)
      legend
        .append('rect')
        .style('fill', color_neg)
        .attr('width', legend_square_size)
        .attr('height', legend_square_size)
        .attr('y', 30)
      legend
        .append('text')
        .text('No doping allegations')
        .attr('x', 25)
        .attr('y', 42)

      //footer
      svgArea
        .append('text')
        .text('Data source: https://en.wikipedia.org')
        .attr('x', w * 0.7)
        .attr('y', h - 20)
        .attr('class', 'footer-info')

      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)
      xAxis.tickFormat(d3.format('.0f'))
      yAxis.tickFormat(d3.timeFormat('%M:%S'))

      //draw xAxis
      svgArea
        .append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,' + (h - padding) + ')')
        .attr('id', 'x-axis')

      //draw yAxis
      svgArea
        .append('g')
        .call(yAxis)
        .attr('transform', 'translate(' + padding + ', 0)')
        .attr('id', 'y-axis')

      //create and draw grid-lines
      const xGrid = (g) =>
        g
          .attr('class', 'grid-lines')
          .selectAll('line')
          .data(xScale.ticks())
          .join('line')
          .attr('x1', (d) => xScale(d))
          .attr('x2', (d) => xScale(d))
          .attr('y1', padding)
          .attr('y2', h - padding)

      const yGrid = (g) =>
        g
          .attr('class', 'grid-lines')
          .selectAll('line')
          .data(yScale.ticks())
          .join('line')
          .attr('x1', padding)
          .attr('x2', w - padding)
          .attr('y1', (d) => yScale(d))
          .attr('y2', (d) => yScale(d))

      svgArea.append('g').call(xGrid)
      svgArea.append('g').call(yGrid)

      let tooltip_info_str = (d) => {
        return (
          d.Name +
          ' : ' +
          d.Nationality +
          '<br>' +
          'Year: ' +
          d.Year +
          '  Time: ' +
          d.Time +
          '<br>' +
          d.Doping
        )
      }
    })
})
