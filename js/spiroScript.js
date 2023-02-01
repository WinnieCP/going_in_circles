function point_on_spiral(theta1, cx, cy, r1, r2, r3, theta_offset) {
    // determines the position of the 'pen' tip
    var x = cx + (r1 - r2) * Math.cos(theta1) + r3 * Math.cos(theta1 * r1/r2 + theta_offset)
    var y = cy + (r1 - r2) * Math.sin(theta1) + r3 * Math.sin(theta1 * r1/r2 + theta_offset)
    return [x,y]
}

function center_disk(theta1, cx, cy, r1, r2) {
    // determines the position of the center of the outer disk
    var x = cx + (r1 - r2) * Math.cos(theta1) 
    var y = cy + (r1 - r2) * Math.sin(theta1)
    return [x,y]
}

function draw_general_spirograph(time, context, cx, cy, r1, r2, r3, theta_offset, tip, disk ){
    theta = time / 800; // this line determines the speed of the outer disk
    [x, y] = point_on_spiral(theta, cx, cy, r1, r2, r3, theta_offset);
    [disk_x, disk_y] = center_disk(theta, cx, cy, r1, r2)
    // spirograph line
    context.lineTo(x, y);
    // move the 'pen' tip
    tip.attr('cx', x).attr('cy', y);
    // move the center of the spinning disk
    disk.attr('cx', disk_x).attr('cy', disk_y);
    // apply stroke
    context.stroke();
}

// Get drawing context
var canvas = d3.select('#drawing_canvas');
var context = canvas.node().getContext('2d');

// center of inner disk
var cx = canvas.attr('width') / 2;
var cy = canvas.attr('height') / 2;
//radius of inner (r1) and spinning (r2) disk
var r1 = 250.;
var r2 = 67;
// radial position of pen (r3) on spinning disk
var r3 = r2-5;
// angular starting position of pen on spinning disk
var theta_offset = 0;
var x0, y0; // starting point of spiral drawing

[x0,y0] = point_on_spiral(0, cx, cy, r1, r2, r3, theta_offset)

// draw the inner disk
d3.select('svg')
    .append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", r1 - (2. * r2))
	.style("fill", 'rgb(50, 102, 63)')
    .attr('id', 'border')
    .transition()
    .duration(6000)
    .ease(d3.easePolyOut.exponent(3.0))
    .style('fill-opacity', 0)
    ;
    
// add the outer spinning disk
d3.select('svg')
    .append("circle")
    .attr("cx",cx+r1-r2)
    .attr("cy",cy)
    .attr("r",r2)
    .style('fill','rgb(50, 102, 63)')
	.style("stroke", 'none')
	.style("fill-opacity", 1)
    .attr('id','disk')
    .transition()
    .duration(6000)
    .ease(d3.easePolyOut.exponent(3.0))
    .style('fill-opacity',0)
    ;
    
// Set up the line drawing
context.beginPath();
context.strokeStyle="rgb(245, 252, 220)";
context.moveTo(x0,y0);

// add a small circle as the (imaginary) pen tip
d3.select('svg')
    .append("circle")
    .attr("cx",x0)
    .attr("cy",y0)
    .attr("r",5)
    .style('fill','white')
    .style("stroke", 'none')
    .attr('id','tip')
    ;

// specify parameters of the spirograph
var draw_specific_spirograph = function(x){
        draw_general_spirograph(x,context, cx, cy, r1, r2, r3, theta_offset, d3.select('#tip'),d3.select('#disk'));
    };

// actually draw the spirograph
d3.timer(
    draw_specific_spirograph
)