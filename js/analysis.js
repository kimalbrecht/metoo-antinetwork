function startAnalysis() {

	var svg, canvas, context;
	var width, height;

	var xScale, ySclae, rScale;

	var data = [];

	var padding = 80;

	function setupVis() {

		width = window.innerWidth;
		height = window.innerHeight;

		canvas = d3.select('#vis').append('canvas')
			.attr('width', width*2)
			.attr('height', height*2)
			.style('width', width + "px")
			.style('height', height + "px")
			.attr("id", "analysisCanvas");

		context = canvas.node().getContext("2d");
		context.scale(2,2);

		svg = d3.select("#vis").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "analysisSvg");

		d3.tsv("data/analysis/Sheet 1-1-over_100_retweets_no_RTs.tsv").then(function(loadedData) {

			loadedData.forEach(function(d) {
				d.retweet_count = +d.retweet_count;
				d.x = Math.random();
				d.y = Math.random();
			});

			data = loadedData.sort(function(a, b) {return d3.descending(a.retweet_count, b.retweet_count)})

			xScale = d3.scaleLinear()
				.domain([0,1])
				.range([padding,width-padding]);

			yScale = d3.scaleLinear()
				.domain([0,1])
				.range([padding,height-padding]);

			rScale = d3.scaleLinear()
				.domain(d3.extent(data, function (d) {
					return +d.retweet_count;
				}))
				.range([3,width/3]);

			//waypoints scroll constructor
			function scroll(n, offset, func1, func2){
			  return new Waypoint({
			    element: document.getElementById(n),
			    handler: function(direction) {
			       direction == 'down' ? func1() : func2();
			    },
			    offset: offset
			  });
			};

			//triger these functions on page scroll
			new scroll('divOneMil', '50%', enterCanvasSVGCircles, clearAll);
			new scroll('divRetweets', '50%', retweetCountSize, enterCanvasSVGCircles);
			new scroll('divOnlyRetweets', '50%', clearCanvas, retweetCountSize);
			new scroll('divAgainstPolicy', '50%', highlightBotTweets, noSelection);
			new scroll('divUnavailableAccounts', '50%', highlightUnavailable, highlightBotTweets);
			new scroll('divPoliticsTweet', '50%', highlightPoliticsTweets, highlightUnavailable);
			new scroll('divMostRetweeted', '50%', mostRetweeted, highlightPoliticsTweets);
			new scroll('divMeTooSocialMedia', '50%', noSelection, mostRetweeted);
			new scroll('divMeTooConception', '50%', meTooTweets, noSelection);

		});

	}

	var drawCanvasCircles;

	let noChange = () =>{
		
	}

	let clearAll = () =>{
		
		clearSVG();
		clearCanvas();
		
	}

	let clearSVG = () =>{
		svg.selectAll(".tweet")
			.transition()
			.duration(100)
			.attr("r", 0)
			.remove();
	}

	let clearCanvas = () =>{
		var bgCount = 0;

		clearInterval(drawCanvasCircles);

		context.fillStyle = "rgba(0, 0, 0, 0.01)";

	    var bgAni = setInterval(function(){
			context.fillRect(0, 0, width, height);
			bgCount += 1;
			if (bgCount > 100) {
				clearInterval(bgAni);
				context.clearRect(0, 0, width, height);
			}
	    }, 10);
	}

	let enterCanvasSVGCircles = () =>{

		var circles = svg.selectAll(".tweet")
			.data(data);

		circles.exit().remove();

		circles.transition()
			.delay( (d,i) => 10*i ) 
			.duration(10)
			.attr("r", function (d) { return 2; } )
			.attr("cx", function (d) { return xScale(d.x); } )
			.attr("cy", function (d) { return yScale(d.y); } )
			.style("fill", "none")
			.style("stroke", "#69b3a2");

		circles
			.enter()
			.append("circle")
			.attr("class", "tweet")
			.attr("cx", function (d) { return xScale(d.x); } )
			.attr("cy", function (d) { return yScale(d.y); } )
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2")
			.attr("r", 0)
			.on("mouseover", function(d) {
				mouseoverEvent(d)
			})
			.on("mouseout", function(d) {
				mouseoutEvent(d)
			})
			.on("click", function(d) {
				mouseClickEvent(d)
			});

		circles
			.transition()
			.delay( (d,i) => 10*i ) 
			.duration(10)
			.attr("r", function (d) { return 2; } );

		context.clearRect(0, 0, width, height);
	    context.fillStyle = 'none';
	    context.strokeWidth = 1;
	    context.strokeStyle = '#69b3a2';

	    var circleCount = 0;

	    drawCanvasCircles = setInterval(function(){
			
				for (var i = 50 - 1; i >= 0; i--) {
					context.beginPath();
					context.arc(Math.random()*width, Math.random()*height, Math.round(Math.random()*2), 0, 2 * Math.PI);
					context.closePath();
					context.fill();
					context.stroke();
				}

				circleCount += 1;

				if (circleCount > 500) {
					clearInterval(drawCanvasCircles);
				}
	    }, 0);

	}

	function mouseoverEvent(data) {
		data.explicitOriginalTarget.style.stroke = "#ffffff";
	}

	function mouseoutEvent(data) {
		svg.selectAll(".tweet").style("stroke", "#69b3a2")
	}
	function mouseClickEvent(datum) {

		d3.selectAll('#tweetText').remove();

		d3.select('#analysisTweetContainerClose')
			.style('display', 'block')
			.on('click', removeTweetText)

		var tweetContainer = d3.select('#analysisText')
			.append('div')
			.attr('id', 'tweetText')
			.append('text')
			.text(datum.srcElement.__data__.text);

	}

	function removeTweetText() {
		d3.select('#analysisTweetContainerClose').style('display', 'none');
		d3.selectAll('#tweetText').remove();
	}

	let retweetCountSize = () =>{

		svg.selectAll(".tweet")
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2")
			.transition()
			.delay( (d,i) => (data.length - i) * 2 ) 
			.duration(1000)
			.attr("r", function (d) { return rScale(+d.retweet_count); } );
	}

	let highlightBotTweets = () =>{
		svg.selectAll(".tweet")
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2")
			.filter(function(d) { return d.text == "@AmyMek's account has been withheld in Germany, France based on local law(s). Learn more." })
			.transition()
			.duration(200)
			.style("fill", "red")
	}
	let highlightUnavailable = () =>{
		svg.selectAll(".tweet")
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2")
			.filter(function(d) { return d.text.includes("account is temporarily unavailable") })
			.transition()
			.duration(200)
			.style("fill", "red")
	}

	let highlightPoliticsTweets = () =>{

		svg.selectAll(".tweet")
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2")
			.filter(function(d) { 
				if (d.text.includes("Trump") || d.text.includes("GOP") || d.text.includes("Kavanaugh")) {
					return true
				}
			})
			.transition()
			.duration(200)
			.style("fill", "blue")
	}

	let mostRetweeted = () =>{

		svg.selectAll(".tweet")
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2")
			.filter(function(d) { return d.retweet_count > 30000 })
			.transition()
			.duration(200)
			.style("fill", "green")
	}

	let meTooTweets = () =>{

		svg.selectAll(".tweet")
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2")
			.filter(function(d) { return d.story })
			.transition()
			.duration(200)
			.style("fill", "purple")

	}

	let noSelection = () =>{

		svg.selectAll(".tweet")
			.style("fill", "rgba(0,0,0,.5)")
			.style("stroke", "#69b3a2");

	}

	setupVis();

	///////////////////
	///////////////////
	/////////////////// Resize Chart
	///////////////////
	///////////////////

	function scaleVis() {

		width = window.innerWidth;
		height = window.innerHeight;

		canvas = d3.select('#analysisCanvas')
			.attr('width', width*2)
			.attr('height', height*2)
			.style('width', width + "px")
			.style('height', height + "px")
			.attr("id", "analysisCanvas");

		context.scale(2,2);

		svg = d3.select("#analysisSvg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "analysisSvg");

		xScale = d3.scaleLinear()
			.domain([0,1])
			.range([padding,width-padding]);

		yScale = d3.scaleLinear()
			.domain([0,1])
			.range([padding,height-padding]);

		rScale = d3.scaleLinear()
			.domain(d3.extent(data, function (d) {
				return +d.retweet_count;
			}))
			.range([2,width/3]);

		svg.selectAll(".tweet")
			.transition()
			.duration(200)
			.attr("cx", function (d) { return xScale(d.x); } )
			.attr("cy", function (d) { return yScale(d.y); } );

		// enterCanvasSVGCircles();

	}

	var debounce = function(fn, timeout) {
	  var timeoutID = -1;
	  return function() {
	    if (timeoutID > -1) {
	      window.clearTimeout(timeoutID);
	    }
	    timeoutID = window.setTimeout(fn, timeout);
	  }
	};

	var throttle = debounce(function() {
	  scaleVis();
	}, 500);

	window.addEventListener('resize', throttle);

	///////////////////
	///////////////////
	/////////////////// Interactive Chart
	///////////////////
	///////////////////

	// var scrollContainer = document.getElementById("analysisiContainer"), timer;

	// window.addEventListener('scroll', function() {
	//   clearTimeout(timer);

	//   console.log(scrollContainer)
	//   if(!scrollContainer.classList.contains('disable-hover')) {
	//     scrollContainer.classList.add('disable-hover')
	//   }
	  
	//   timer = setTimeout(function(){
	//     scrollContainer.classList.remove('disable-hover')
	//   },500);
	// }, false);

}