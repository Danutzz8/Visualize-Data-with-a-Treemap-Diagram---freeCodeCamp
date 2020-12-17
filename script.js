let movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

let movieData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawTreeMap = () => {
    
    let hierarchy = d3.hierarchy(movieData, (node) => node['children'])
                        .sum((d) => d['value']) // this will determin the size of the tales based on the revenue/value
                        .sort((d1, d2) => d2['value'] - d1['value']) // this is making sure that nodes with the higher value comes first
                        
    let createTreeMap = d3.treemap()
                            .size([1000, 600]) 

    createTreeMap(hierarchy)
    // console.log(hierarchy.leaves());
    
    let movieTiles = hierarchy.leaves()
    // console.log(movieTiles)
    
    let block = canvas.selectAll('g')
                        .data(movieTiles)
                        .enter()
                        .append('g')
                        .attr('transform', (movie) => 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')') // this will implement the coordinates on the rectangles so that they will apear in the desired place on the canvas


    block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (movie) => {
                let category = movie['data']['category']
                if(category === 'Action'){
                    return '#f8c291'
                }else if(category === 'Drama'){
                    return 'lightgreen'
                }else if(category === 'Adventure'){
                    return '#e58e26'
                }else if(category === 'Family'){
                    return 'lightblue'
                }else if(category === 'Animation'){
                    return 'pink'
                }else if(category === 'Comedy'){
                    return 'khaki'
                }else if(category === 'Biography'){
                    return 'tan'
                }
            })
            .attr('data-name', (movie) => movie['data']['name'])
            .attr('data-category', (movie) => movie['data']['category'])
            .attr('data-value', (movie) => movie['data']['value'])
            .attr('width', (movie) => movie['x1'] - movie['x0']) // we gave the tile the width & height by substracting the coordonates
            .attr('height', (movie) => movie['y1'] - movie['y0'])
            .on('mouseover', (d) => {
                tooltip.transition()
                        .style('visibility', 'visible')

                let revenue = d['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") // using regex formula we add coma every 3num

                tooltip.html(
                    '$ ' + revenue + '<hr />' + d['data']['name'])

                tooltip.attr('data-value', d['data']['value'])
            })
            .on('mouseout', (d) => {
                tooltip.transition()
                        .style('visibility', 'hidden')

            })

    block.append('text')
            .text((movie) => movie['data']['name'])
            .attr('x', 5)
            .attr('y', 20)
            

}

// importing data 
d3.json(movieDataUrl).then(
    (data, error) => {
        if (error) {
        console.log(error)
    } else {
        movieData = data
        // console.log(movieData);
        drawTreeMap()
    } 
    }
)

