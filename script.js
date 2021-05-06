
var setup = function(targetID){
	//Set size of svg element and chart
	var margin = {top: 40, right: 230, bottom: 250, left: 180},
		width = screen.width - margin.left - margin.right,
		height = screen.height - margin.top - margin.bottom,
		categoryIndent = 5*15 + 5,
		defaultBarWidth = 5000;

	//Set up scales
	var x = d3.scaleLinear()
	  .domain([0,defaultBarWidth])
	  .range([0,width]);
	var y = d3.scaleBand()
	  .range([ 0, height ])
    .padding(.1);

	//Create SVG element
	d3.select(targetID).selectAll("svg").remove()
	var svg = d3.select(targetID).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
  //Axis setting
	const g = svg.append("g");
	  g
    .attr("transform", "translate(0,0)")
    .call(d3.axisBottom(x)
      .tickSize(height)
      )  
    .selectAll("text")
     .style("text-anchor", "end");

	//Package and export settings
	var settings = {
	  margin:margin, width:width, height:height, categoryIndent:categoryIndent,
	  svg:svg, x:x, y:y ,g:g
	}
	return settings;
}

var redrawChart = function(targetID, newdata) {

	//Import settings
	var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent, 
	svg=settings.svg, x=settings.x, y=settings.y,g=settings.g;

	//Reset domains
	y.domain(newdata.sort(function(a,b){
	  return b.value - a.value;
	})
	  .map(function(d) { return d.Cities; }));
	var barmax = d3.max(newdata, function(e) {
	  return e.value;
	});
	x.domain([0,5000]);
 

	//Create chart row and move to below the bottom of the chart
	var chartRow = svg.selectAll("g.chartRow")
	  .data(newdata, function(d){ return d.Cities});
	var newRow = chartRow
	  .enter()
	  .append("g")
	  .attr("class", "chartRow")
	  .attr("transform", "translate(0," + height + margin.top + margin.bottom + ")");

    //Color setting
    var colors= d3.scaleOrdinal().domain(function(d) { return x(d.Cities);})
                .range(['#8C4545',
'#92484F',
'#ffb366',
'#9B5063',
'#9D556E',
'#ffff66',
'#9F6184',
'#9E678E',
'#9B6E99',
'#ff6666',
'#917DAC',
'#8A85B4',
'#828DBC',
'#7895C2',
'#6b5b95',
'#61A4CB',
'#53ACCD',
'#45B3CE',
'#993366',
'#29C1CB',
'#1EC8C8',
'#1DCEC3',
'#F5D6C6',
'#36D9B6',
'#e6005c',
'#59E4A6',
'#ff6666',
'#FFD662',
'#91F08B',
'#A4F482',
'#B8F779',
'#CCF972']);

	//Add rectangles
	newRow.insert("rect")
	  .attr("class","bar")
	  .attr("x", 0)
	  .style("opacity",0.95)
	  .attr("height", y.bandwidth())
	  .attr("width", function(d) { return x(d.value);})
	  .style('fill',function(d,i){
     return colors(i);
  }) 

	//Add value labels
	newRow.append("text")
	  .attr("class","label")
	  .attr("y", y.bandwidth()/2)
	  .attr("x",function(d) { return x(d.value)-5;})
	  .attr("opacity",1)
	  .attr("dy",".35em")
	  .attr("dx","0.3em")
	  .style('fill', "#E8E8E8")
	  .style('font-size','12px')
	  .text(function(d){return d.value;}); 

	//Add Headlines
	newRow.append("text")
	  .attr("class","category")
	  .attr("text-overflow","ellipsis")
	  .attr("y", y.bandwidth()/2)
	  .attr("x",-20)
	  .style("text-anchor", "end")
	  .style("font-size", "12px")
	  .style('font-weight','bold')
	  .style("opacity",1)
	  .attr("dy",".25em")
	  .attr("dx","0.3em")
	  .style('fill', "#F5F5F5")
	  .text(function(d){return d.Cities});


	//////////
	//UPDATE//
	//////////
	
	//Update bar widths
	chartRow.select(".bar").transition()
	  .duration(400)
	  .attr("width", function(d) { return x(d.value);})
	  .attr("opacity",1);

	//Update data labels
	chartRow.select(".label").transition()
	  .duration(400)
	  .attr("x",function(d) { return x(d.value)+5;})
	   .textTween(function(d) {
	   	var content=+this.textContent
      return d3.interpolateRound(content, d.value);
       }); 
	  

	//Fade in categories
	chartRow.select(".category").transition()
	  .duration(400)
	  .attr("opacity",1);


	////////
	//EXIT//
	////////

	//Fade out and remove exit elements
	chartRow.exit().transition()
	  .style("opacity","0")
	  .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
	  .remove();

	////////////////
	//REORDER ROWS//
	////////////////

	var delay = function(d, i) { return 200 + i * 30; };

	chartRow.transition()
		.delay(delay)
		.duration(700)
		.attr("transform", function(d){ return "translate(0," + y(d.Cities) + ")"; });
};


var keys=['SixT','SevenT','EightT','ElevenT','TwelveT','FourteenT','FifteenT','SixteenT','SeventeenT','EighteenT','NineteenT','TwentyT',
'TwentyoneT','TwentytwoT','TwentythreeT','TwentyfourT','TwentyfiveT','TwentysixT','TwentysevenT','TwentyeightT','TwentynineT','OneO','TwoO','ThreeO'];
var number=0
var date=['98/12/6','98/12/7','98/12/8','98/12/11','98/12/12','98/12/14','98/12/15','98/12/16','98/12/17','98/12/18','98/12/19','98/12/20','98/12/21','98/12/22',
'98/12/23','98/12/24','98/12/25','98/12/26','98/12/27','98/12/28','98/12/29','99/01/01','99/01/02','99/01/03']

var pullData = function(settings,callback,number){
	d3.csv("corona.csv").then(function(data){
		var newData = data;
		data.forEach(function(d,i){
			var newValue = +d[keys[number]]//+ Math.floor((Math.random()*10) - 5)
			newData[i].value = newValue //<= 0 ? 10 : newValue
		})

		newData = formatData(newData);
        d3.select('.date')
        .text("13"+date[number]);
		callback(settings,newData);
	})
}

//Sort data in descending order and take the top 10 values
var formatData = function(data){
    return data.sort(function (a, b) {
        return b.value - a.value;
      })
	  //.slice(0, 20);
}

//I like to call it what it does
var redraw = function(settings){
	pullData(settings,redrawChart,number)
	if(number <=22){
      number=number+1;
	}
	else{
		number=1
	}
	
}


//setup (includes first draw)
var settings = setup('#chart');
redraw(settings)

//Repeat every 3 seconds
setInterval(function(){
	redraw(settings)
}, 2500);
