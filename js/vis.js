
var svg, width, height, g, zoom;

var visViews = {
views: [
	{
		'name': '#WhyIDidntReport',
		'imgLink': 'data/v09-report/metoo-bg-web-lg.jpg',
		'dataLink': 'data/v09-report/pathExport.json',
		'transitionDelay': 20,
		'transitionDuration': 1,
		'text': '<text><b>WARNING: This visualization contains strong language</b></text><br><br><text>Of the one million #MeToo tweets, we examined 3,930 which employed the hashtag #WhyIDidntReport. Throughout our research, we read all of these tweets, selecting over 1,000 of them as testimony of Twitter users, who were bearing witness to their own experiences of mistreatment, violence, and erasure. Often, these tweets are not richly linked-to and are almost never retweeted, but are one-time expressions from everyday users of the platform. The diagram of the #WhyIDidntReport tweets seem to emerge as a cloudscape of individual voices, becoming stronger in assemblage, without losing the individuality too often hidden by the lack of visibility of single voices online. They twist and curve as they nestle into one another by length, seeking shared strength in proximity. The color gradients do not represent discrete dimensions of the data, but suggest the colorings of voice by experience and affect: the anti-network of human feeling outside Twitter, to which the network is so often deaf.</text>'
	},{
		'name': '#MeToo',
		'imgLink': 'data/v05-metoo/metoo-bg-web-lg.jpg',
		'dataLink': 'data/v05-metoo/pathExport.json',
		'transitionDelay': 1,
		'transitionDuration': 5,
		'text': '<text>More than eighty thousand tweets in the archive have fewer than six characters. They read: "#MeToo", "#metoo," or "#METOO," with no further explanation. As with the other anti-network visualizations from our archive, what is not present becomes conspicuous in its absence. Acts of witness, solidarity, and quiet accusation, they resist the compulsion to share details for media consumption. They might be compared to veiled acts of protest— masked or blindfolded demonstrations; "die-ins" and yellow ribbons–in real-world settings. But on Twitter, this sort of subtlety and self-protection is less efficacious; not many people "like" the #MeToo #metoo and #METOO tweets. Almost nobody retweets them. In the visualization, they stand together in witness to structural violence that can barely be named, to experiences that are still too close to fully disclose.</text><br><br><text>In Latin America, feminist activists who track feminicide talk about <a target=”_blank” href="http://mappinginjustice.org/wp-content/uploads/sites/8/2019/11/S7.1-SuarezVal_MappingFeminicide_MIJ2019.pdf">visibilizing violence</a>, especially gender-based violence that is normalized and tolerated so widely that it is folded back invisibly into the fabric of everyday life. When gender-based violence is invisible to society the cost is displaced to individual survivors who must continue to survive amongst the trauma, stigma and victim-blaming that follow from invisibility. But as the Combahee River Collective stated, “the personal is political". What this means is that when we pool our personal experiences, we can plainly see the aggregate patterns that indicate that our trauma is not our fault. We can seek justice that is political and visibility that is collective. This visualization contributes a small step towards the visibilization of gender-based violence and the formulation of structural solutions to structural problems.</text>'
	},{
		'name': 'Indigenous',
		'imgLink': 'data/v04-indigenous/metoo-bg-web-lg.jpg',
		'dataLink': 'data/v04-indigenous/pathExport.json',
		'transitionDelay': 1,
		'transitionDuration': 1,
		'text': '<text>From the one million random tweets on #MeToo we investigated only 219 contained the term "Indigenous." We found that one account produced the majority of these 219 tweets, focused on the Trump administration an using the word "indigenous" in ways peripheral to #MeToo. The nine tweets diagrammed here bring out the personal dimension. There is no beginning or end, and the data pick arbitrary starting and ending points. Talking about the past brings it into the present. The spiral is spinning outward; this is not an ending—witness is spinning outward in time. But this upwelling and outward-spinning energy meets the resistance of the normative. How does the network of hashtag-based communication persistently come to erase Indigenous voices and privilege white perspectives? How do we face the present fact that not only land but the space of dialogue is stolen and appropriated? Twitter, too, is stolen land.</text>'
	},{
		'name': '15th October 2017',
		'imgLink': 'data/v01-first-day/metoo-bg-web-lg.jpg',
		'dataLink': 'data/v01-first-day/pathExport.json',
		'transitionDelay': 20,
		'transitionDuration': 1,
		'text': '<text>At 10:21 PM on October 15, 2017, American actress Alyssa Milano tweeted about #MeToo. Some call this the beginning of the #MeToo movement. But the hashtag, and the movement, have a much longer history. In 2006, American activist Tarana Burke used the phrase "Me Too" to raise awareness of women who had experienced sexual assault. The Schlesinger Library tweet collection starts from midnight, October 15, 2017. Thus it covers 22 hours and 21 minutes of tweeting prior to the tweet from Milano. The diagram displays the build-up to virality, while emphasizing the neglected and forgotten ancestors of Milanos tweet. Within the flow of anonymized tweets, some are from Tarana Burke, the activist who started the Me Too Movement in 2006. The database contains eight tweets she posted in the hours prior to Milano’s viral tweet.</text>'
	}]
}

var currentView = Math.floor(Math.random()*visViews.views.length);

var w, h;

function setupVis() {

	d3.select('#loadingContainer')
		.style('opacity', 1)
		.style('display', 'flex');

	d3.select('#infoText').select('.overlayText').html(visViews.views[currentView].text)

	 width = 5000;
	 height = 5004;

	svg = d3.select("#vis").append("svg")
		.attr("preserveAspectRatio", "xMidYMid slice")
		.attr("viewBox", 0+" "+0+" "+ width +" "+ height )
		.attr("id", "svg");

	g = svg.append("g");

	///////////////////
	///////////////////
	/////////////////// Zoom
	///////////////////
	///////////////////

	w = window.innerWidth;
	h = window.innerHeight;

	zoom = d3.zoom()
		.scaleExtent([.75, 3])
		.translateExtent(aspectRatioCalc(w,h))
		.on("zoom", zoomed)
		.on("end", zoomEndFunction)

	function zoomed(event) {
		const {transform} = event;
		g.select("#image").attr("transform", transform);
		g.selectAll(".paths").style("visibility", "hidden");
	}

	function zoomStartFunction() {
		g.selectAll(".paths").style("visibility", "hidden");
	}
	function zoomEndFunction(event) {
		const {transform} = event;
		g.selectAll(".paths").attr("transform", transform);
		g.selectAll(".paths").style("visibility", "visible");
	}

	///////////////
	/////////////// IMG Load
	///////////////

	var imgLoad = g.append('image')
		.attr("href", visViews.views[currentView].imgLink)
		.attr("id", "image")
		.attr('x', 0)
		.attr('y', 0)
		.style('opacity', 0)
		.attr('width', width)
		.attr('height', height)
		.on("load", loadData);

	////////////////// Center Visualization
	if (w > h) {
		var aspect = 1 - h / w;

		svg.transition().duration(0).call(
			zoom.transform,
			d3.zoomIdentity
				.translate(0, (-height*aspect)/2)
				.scale(1));
	}

}

function loadData() {
	d3.json(visViews.views[currentView].dataLink).then(function(data) {

		d3.select('#loadingContainer').transition()
			.delay(2000)
			.duration(500)
			.style('opacity', 0)
			.style('display', 'hidden')
			// .remove();

		d3.select("#image").transition()
			.delay(2000)
			.duration(0)
			.style('opacity', 1);

		var xScale = d3.scaleLinear()
			.domain([-5,5])
			.range([0,width]);

		var yScale = d3.scaleLinear()
			.domain([-5,5])
			.range([0,height]);

		var line = d3.line()
			.curve(d3.curveCatmullRom.alpha(0.5))
			.x(function(d) { return xScale(d.x); })
			.y(function(d) { return yScale(d.y); });

		var paths = g.selectAll('.paths')
			.data(data)
			.enter()
			.append("path")
			.attr("class", "paths")
			.attr("d", function(d) { return line(d.pathData); })
			.attr('stroke-linecap', 'round')
			.attr('stroke', 'rgba(0,0,0,1)')
			.attr('stroke-width', '30px')
			.attr('fill', 'none')
			.each(function(d,i) { 
				d.totalLength = this.getTotalLength(); 
				d.id = i;
			})
			.attr('id', function(d,i) { return 'line'+d.id; })
			.attr("stroke-dasharray", function(d) { return d.totalLength + " " + d.totalLength })
			.attr("stroke-dashoffset", 0);

		// resizeVis();

		if (w > h) {
			var aspect = 1 - h / w;

			svg.transition().duration(10).call(
				zoom.transform,
				d3.zoomIdentity
					.translate(0, (-height*aspect)/2)
					.scale(1));
		} else {

			svg.transition().duration(0).call(
				zoom.transform,
				d3.zoomIdentity
					.translate(0, 0)
					.scale(1));
		}

		paths
			.transition()
			.delay(11)
			.ease(d3.easeExp)
			.delay(function(d,i) { return visViews.views[currentView].transitionDelay*i}) // 20
			.duration(function(d) { return d.totalLength*visViews.views[currentView].transitionDuration }) // *4
			.attr("stroke-dashoffset", function(d) { return d.totalLength })
			.end()
			.then(() => {
				hoverFun();
			});

		setTimeout(function() {
			///////////////// Show Intro Text
			document.getElementById("infoText").style.display = "flex";
		}, 3000);

	});
}

function aspectRatioCalc(w,h) {

	var result = [[0,0],[width,height]];

	if (w > h) {
		var aspect = 2 - h / w;
		result = [[0,0],[width,height*aspect]];
	} else {
		var aspect = 1 - w / h;
		result = [[-width*aspect/2,0],[width + width*aspect/2, height]];
	}

	return result

}

		///////////////////
		///////////////////
		/////////////////// Resize
		///////////////////
		///////////////////

window.addEventListener("resize", resizeVis);

function resizeVis() {

	w = window.innerWidth;
	h = window.innerHeight;

				////////////////// Center Visualization
		if (w > h) {
			var aspect = 1 - h / w;

			svg.transition().duration(2000).call(
				zoom.transform,
				d3.zoomIdentity
					.translate(0, (-height*aspect)/2)
					.scale(1));
		}

	zoom.translateExtent(aspectRatioCalc(w,h));

}

		///////////////////
		///////////////////
		/////////////////// Hover
		///////////////////
		///////////////////

function hoverFun() {

	///////////////// Enable Zoom

	svg.call(zoom);

	///////////////// Hover

	d3.selectAll('.paths')
		.attr("class", "hoverPaths paths")
		.attr('stroke', 'rgba(255,255,255,0)')
		.attr("stroke-dashoffset", 0)
		.on("click", textClick)

}

function textClick() {

	var currText = this.__data__.text;

	if (visViews.views[currentView].name == "#MeToo") {
		currText = currText.replaceAll("|| ", "<br>");
	}

	d3.select('#tweetContainer').select('text').remove();

	d3.select('#tweetContainer').style('pointer-events', 'auto');

	d3.select('#tweetContainerClose').style('display', 'block');

	d3.select('#tweetContainer')
		.attr('background', 'rgba(255,255,255,1)')
		.html('<text>' + currText + '</text>');

}

function removeText() {
	d3.select('#tweetContainerClose').style('display', 'none');
	d3.select('#tweetContainer').style('pointer-events', 'none');
	d3.select('#tweetContainer').select('text').remove();

}
