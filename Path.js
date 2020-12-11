/*
Holds list of list [x, y], which are translated
to points on the canvas.
*/
class Path{
	//Path holds a list of points
	constructor(pathList){
		this.pointPath = pathList;

		/*
		this.neighbors is set up to be one-to-one w/ this.pointPath.
		i.e. this.pointPath[0]'s neighbors are stores in this.neighbors[0]

		Then, this.neighbors is set up to be like:
		this.neighbors[0] = [[x, y], #]
			Here:
			[x, y] - the coordinates of one of its neighbors
			# - distance from current node to its neighbor
		*/
		this.neighbors = [];
	}

	show(){
		//makes Asters (pollinated plant Bees enjoy);
		for(let marker of this.pointPath){
			strokeWeight(10)
  			stroke(255, 255, 0, 255)
			fill(255, 255, 0, 255);
			point(marker[0], marker[1]);
			strokeWeight(0);
			fill(128,0,128)
			ellipse(marker[0], marker[1]+15,10, 20);
			ellipse(marker[0], marker[1]-15,10, 20);
			ellipse(marker[0]+15, marker[1],20, 10);
			ellipse(marker[0]-15, marker[1],20, 10);
		}
	}

	getPath(){
		return this.pointPath
	}

	addPoint(x, y){
		//add to path
		this.pointPath.push([x, y]);
		console.log("Neibor: ", this.neighbors)

		//add to neighbors
		this.neighbors.push([]);

		if(this.pointPath.length > 1){
			//update all flower nodes w/ their new neighbors (just added flower)
			for(var i = 0; i < this.pointPath.length; i++){
				for(var j = 0; j < this.pointPath.length;j++){
					//make sure i != j
					if(i == j)
						continue

					//if already a neighbors in list
					if(this.neighbors[i].includes(this.pointPath[j]))
						continue

					//layout: [neighbors, length away from current]
					// in neighbors, even values (including 0) are node location & odds are distance away
					this.neighbors[i].push(this.pointPath[j]);			//neighbors

					//calculate manhattan distance: abs(a.x - b.x) + abs(a.y - b.y)
					var distance = abs(this.pointPath[i][0] - this.pointPath[j][0]) + abs(this.pointPath[i][1] - this.pointPath[j][1])
					this.neighbors[i].push(distance);
				}
			}
			console.log("PATH LIST: ", this.pointPath);
			console.log("NEIGHBORS: ", this.neighbors);
		}
	}
}