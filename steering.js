/*
TODO:
-add new path elements (neighbors) to work in this class
-implement dijkstras

*/
class Boid {
	constructor() {
		//vectors rooted @ (0, 0)
		this.position = createVector(60, 80);
		this.velocity = createVector(random(0, 5), random(0, 5));//p5.Vector.random2D();
		//speed at which boids move
		this.velocity.setMag(random(2, 4));
		this.acceleration = createVector();
		//limit boid vector alignment / magnitude
		this.maxForce = 1;
		//set speed limit
		this.maxSpeed = 4;
		//false - rand  / true - follow mouse
		this.randOrFollow = 'random';

		//Side detection
		this.hitTop = this.hitBot = this.hitRight = this.hitLeft = false;

		//For random movement in update()
		this.moveTick = 0;

		//Controls when near flowers in flock()
		this.cnt = 0;
	}

	// If the bee gets close to an edge, then he moves opposite to that edge
	ifAtEdge(){
		if(this.position.x > width - 50){
			this.hitRight = true;
			this.hitTop = this.hitBot = this.hitLeft = false
			console.log("HIT RIGHT")
		}
		else if(this.position.x < 50){
			this.hitLeft = true;
			this.hitTop = this.hitBot = this.hitRight = false
			console.log("HIT LEFT")
		}

		else if(this.position.y > height - 50){
			this.hitBot = true;
			this.hitTop = this.hitRight = this.hitLeft = false
			console.log("HIT BOT")
		}
		else if(this.position.y < 50){
			this.hitTop = true;
			this.hitBot = this.hitRight = this.hitLeft = false
			console.log("HIT TOP")
		}
	}

	show(boidType){
		//bee
		if(boidType == 'Bee'){
			strokeWeight(10);
			stroke(255, 255, 0);
			point(this.position.x, this.position.y);

			//Adds velocity line to bee in order to view direction
			strokeWeight(2);
			stroke(255, 0, 0);
			line(this.position.x, this.position.y, 
				this.position.x + this.velocity.x*10, 
				this.position.y + this.velocity.y*10);
		}
		//Triangle
		else{
			
			let triangleSize = 12;

	        let x = this.position.x;
	        let y = this.position.y;
	        fill(51);
	        stroke(255);
	        push();
	        translate(x, y);
	        rotate(this.velocity.heading() - radians(90));
	        triangle(
	          0,
	          0,
	          triangleSize,
	          0,
	          triangleSize / 2,
	          triangleSize * 1.2
	        );
	        pop();
	    }

	}

	//Fix this to stop bee moving like a stutter
	update() {
		this.ifAtEdge();
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.acceleration.mult(0);
		if(this.randOrFollow == 'random'){
			this.moveTick += 1;
			if(this.moveTick == 20){
				if(this.hitRight){
					this.velocity = createVector(random(-3, 0), random(-3, 3));
				}
				else if(this.hitLeft){
					console.log("HIT LEFT INNIT")
					this.velocity = createVector(random(0, 3), random(-3, 3));
				}
				else if(this.hitBot){
					this.velocity = createVector(random(-3, 3), random(-3, 0));
				}
				else if(this.hitTop){
					this.velocity = createVector(random(-3, 3), random(0, 3));
				}
				else{
					this.velocity = createVector(random(-3, 3), random(-3, 0));
				}
				this.moveTick = 0;
			}
		}
	}

	avg(fellowBoids, vectorType){
		var inRange = 0;			//Flag to check if any boids were in the range at all
		//grab average velocity
		var avgVel = createVector();
		for(let i = 0; i < fellowBoids.length; i++){
			let distance = dist(
							this.position.x,
							this.position.y,
							fellowBoids[i].position.x,
							fellowBoids[i].position.y)
			//if in radius of 100 from boid
			if(this != fellowBoids[i] && (distance <= 50)){
				if(vectorType == 'cohesion'){
					avgVel.add(fellowBoids[i].position);
				}
				else if(vectorType == 'separation'){
					//vector pointing from other to me
					let differenceVector = p5.Vector.sub(this.position, fellowBoids[i].position);
					//have difference be inversely proportional to differenceVector
					differenceVector.div(distance * distance);
					avgVel.add(differenceVector);
					inRange++;
				}
				else if(vectorType == 'alignment'){
					avgVel.add(fellowBoids[i].velocity);
				}
				inRange++;
			}
		}

		if(inRange > 0){
			avgVel.div(inRange);

			if(vectorType == 'cohesion'){
				avgVel.sub(this.position);
			}

			avgVel.setMag(this.maxSpeed);
			avgVel.sub(this.velocity);
			avgVel.limit(this.maxForce);

		}
		return avgVel;
	}

	flock(fellowBoids, path){
		if(this.randOrFollow == 'random'){
			this.acceleration.mult(0);
			let alignment = this.avg(fellowBoids, 'alignment');
			let cohesion = this.avg(fellowBoids, 'cohesion');
			let separation = this.avg(fellowBoids, 'separation');
			//Since mass =1 then A = F/1
			this.acceleration.add(separation);
			this.acceleration.add(alignment);
			this.acceleration.add(cohesion);

			//if close enough to the object report back
			var falseObjs = [[width/2, height/2], [300, 50]];
			//console.log("HERE: ");
			//console.log(path.pointPath)
			//alert();
			for(let x of path.pointPath){
				var distToObj = abs(this.position.x - x[0]) + abs(this.position.y - x[1]);
				if(distToObj <= 150 && path.hiveNeighbors.indexOf(x) == -1){
					console.log("WITHIN RANGE!: ", x);
					//alert();
					//TODO: **PUSH [[x, y], distanceToHive] TO THE NEIGHBORS OF THE HIVE**
					path.hiveNeighbors.push(x);
					break;
				}
			}

			//When bee has found two flowers, go back to hive & let out workers
			if(path.hiveNeighbors.length == 2){
				this.randOrFollow = 'BackToHive';
			}
		}
		//Bee moves back towards the hive until it've close enough & movement switches to 'pathInOrder'
		else if(this.randOrFollow == 'BackToHive'){
				//alert();
				let hiveVector = createVector(60, 80);
				let distanceToHive = dist(
										this.position.x,
										this.position.y,
										hiveVector.x,
										hiveVector.y);
				let directionToHive = p5.Vector.sub(hiveVector, this.position);
				directionToHive.normalize();
				directionToHive.mult(0.5);
				this.acceleration = directionToHive;

				let alignment = this.avg(fellowBoids, 'alignment');
				let separation = this.avg(fellowBoids, 'separation');
				//Since mass =1 then A = F/1
				this.acceleration.add(separation);
				this.acceleration.add(alignment);
		}
		else if(this.randOrFollow == 'pathInOrderOld'){
			//TODO: If within ~15 of the flower then move onto the next

			//follow points (start w/ first in list of pointPath)
			let pointLocation = path.hiveNeighbors;
			let tmpPoint = createVector(pointLocation[this.cnt][0], pointLocation[this.cnt][1])
			let distance = dist(
							this.position.x,
							this.position.y,
							pointLocation[this.cnt][0],
							pointLocation[this.cnt][1])

			//if it's close enough to the flower
			if(distance <= 10){
				this.cnt++;
				if(this.cnt > pointLocation.length - 1)
					this.cnt = 0;
			}

			let direction = p5.Vector.sub(tmpPoint, this.position);
			direction.normalize();
			direction.mult(0.5);
			this.acceleration = direction;

			let alignment = this.avg(fellowBoids, 'alignment');
			let cohesion = this.avg(fellowBoids, 'cohesion');
			let separation = this.avg(fellowBoids, 'separation');
			//Since mass =1 then A = F/1
			this.acceleration.add(separation);
			this.acceleration.add(alignment);
		}
		//Default to this when press 'Go Bees'
		else if(this.randOrFollow == 'pathInOrder'){
			console.log("In pathInOrder");
			var dijkstraPath = dijkstras(path, fellowBoids);
		}

	}

	//Finds the shortest path from one of the starting flowers found to the furthest flower from it?
	dijkstras(path, fellowBoids){
		var expandability = new priQ();
		expandability.push(0, [60, 80]);
		//var came_from
	}
}