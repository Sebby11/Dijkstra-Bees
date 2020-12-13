/*
TODO:
-send neighbors from path to steering

*/

var flock = [];
typeFlock = 'Bee';
slideVal = 25;
whoFollow = 'random';
beesLoose = false;
path = [];
beeReceived = false;

function setup() {
	// put setup code here
	triButton = createButton('Triangle');
	//triButton.position(10, 10);
	triButton.mousePressed(changeTri);

	beeButton = createButton('Bee');
	//beeButton.position(70, 10);
	beeButton.mousePressed(changeBee);

	slider = createSlider(1, 50, 1);

	goBeesButton = createButton('Go Bees');
	goBeesButton.mousePressed(goBees);

	followPathButton = createButton('Follow flower Path');
	followPathButton.mousePressed(followPath);

	clearFlowers = createButton('Clear');
	clearFlowers.mousePressed(clearAll);

	createCanvas(700,700);

	//Create Flock
	for(let i = 0; i < 25; i++)
		flock.push(new Boid());

	//Create Path
	path = new Path(path);
}

function draw() {
	// put drawing code here
	if(slider.value() != slideVal){
		//console.log(slider.value())
		//if less
		if(slider.value() < slideVal){
			for(let i = 0; i < slideVal - slider.value(); i++)
				flock.pop();
		}
		//if more
		if(slider.value() > slideVal){
			for(let i = 0; i < slider.value() - slideVal; i++)
				flock.push(new Boid());
		}
	}
	slideVal = slider.value();
	background(0);

	//***Testing for locating something within a radius***
	strokeWeight(3);
	stroke(51);
	fill(255, 0, 0);
	line(50, 0, 50, 700);
	line(0, 50, 700, 50);
	line(0, 700 - 50, 700, 700 - 50)
	line(700 - 50, 0, 700 - 50, 700)

	//create hive
	strokeWeight(3);
	stroke(51)
	fill(255, 204, 0)
	//hive
	ellipse(60, 80, 80, 20);
	ellipse(60, 60, 60, 20);
	ellipse(60, 40, 40, 20);
	ellipse(60, 20, 10, 20);
	fill(0)
	//hive hole
	ellipse(60, 80, 5, 5);

	//Path
	path.show();

	if(beesLoose){
		//Boids
		for(let boid of flock){
			boid.randOrFollow = whoFollow;
			boid.flock(flock, path);//, path.pointPath, path.neighbors);
			//boid.ifAtEdge();
			boid.update();
			if(typeFlock == 'Bee')
				boid.show('Bee');
			else
				boid.show('Tri');

			//Once it's back at the hive stop showing
			let distBackToHive = dist(
								boid.position.x,
								boid.position.y,
								60,
								80);
			//console.log(distBackToHive);

			if(path.hiveNeighbors.length == path.pointPath.length && !beeReceived){
				whoFollow = 'BackToHive';
				if(distBackToHive < 10){
					//here is where we make the bee disappear once it reaches the hive
					clearBee();
				}
			}

		}
	}
}

function changeTri(){
	typeFlock = 'Tri';
}

function changeBee(){
	typeFlock = 'Bee';
}

function followPath(){
	if(path.pointPath.length == 0)
		return
	//console.log('here')
	whoFollow = 'pathInOrderOld';
}

function clearAll(){
	//clear flowers
	path.pointPath = [];
	path.hiveNeighbors = [];

	//clear boid
	flock = []
	for(let i = 0; i < 1; i++)
		flock.push(new Boid());

	whoFollow = 'random';
	beesLoose = false;
}

function clearBee(){
	//clear boid
	flock = []
	for(let i = 0; i < 1; i++)
		flock.push(new Boid());
	beesLoose = false;
	beeReceived = true;
	console.log("Path: ", path.pointPath, "\n Neighbors: ", path.neighbors, "\n Hive Neighbors: ", path.hiveNeighbors);
	whoFollow = 'pathInOrderOld';
}

function mouseReleased(){
	if(mouseX > 699 || mouseY > 699)
		return
	path.addPoint(mouseX, mouseY);
}

function goBees(){
	//Check if there is a path at all. If not - do random // If so - do path
	if(path.pointPath.length > 0){
		
		//**uncomment this when you've figured out the bee finding 2 flowers
		//whoFollow = 'random';
	}

	beesLoose = true;
}