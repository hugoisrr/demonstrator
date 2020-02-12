socket.on('rawDataVacuum', function(raw2){
    // console.log(raw2);
    document.getElementById("raw2").innerHTML = JSON.stringify(raw2);

    now = new Date()

        // Add new values
        for (var name in groups2) {
            var group = groups2[name]
            //group.data.push(group.value) // Real values arrive at irregular intervals
            raw2.values.forEach(element => {
                group.data.push(element.accx);
                group.data.push(element.accy);
                group.data.push(element.accz);
            });
            group.path.attr('d', line2)
        }

        // Shift domain
        x.domain([now - (limit - 2) * duration, now - duration])

        // Slide x-axis left
        axis2.transition()
            .duration(duration)
            .ease('linear')
            .call(x.axis)

        // Slide paths2 left
        paths2.attr('transform', null)
            .transition()
            .duration(duration)
            .ease('linear')
            .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
            .each('end', tick)

        // Remove oldest data point from each group
        for (var name in groups2) {
            var group = groups2[name]
            group.data.shift()
        }
});

var limit = 15 * 1,
        duration = 250,
        now = new Date(Date.now() - duration)

    var width = 350,
        height = 200

    var groups2 = {
        current: {
            value: 0,
            color: 'orange',
            data: d3.range(limit).map(function() {
                return 0
            })
        },
        target: {
            value: 0,
            color: 'green',
            data: d3.range(limit).map(function() {
                return 0
            })
        },
        output: {
            value: 0,
            color: 'grey',
            data: d3.range(limit).map(function() {
                return 0
            })
        }
    }

    var x = d3.time.scale()
        .domain([now - (limit - 2), now - duration])
        .range([0, width])

    var y = d3.scale.linear()
        .domain([0, 1])
        .range([height, 0])

    var line2 = d3.svg.line()
        .interpolate('basis')
        .x(function(d, i) {
            return x(now - (limit - 1 - i) * duration)
        })
        .y(function(d) {
            return y(d)
        })

    var svg = d3.select('.graph2').append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height + 50)

    var axis2 = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

    var paths2 = svg.append('g')

    for (var name in groups2) {
        var group = groups2[name]
        group.path = paths2.append('path')
            .data([group.data])
            .attr('class', name + ' group')
            .style('stroke', group.color)
    }

    function tick() {
    
    }

    tick()