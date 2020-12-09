function main() {
	console.log("Start");
	var queue = new priQ();

	queue.push(0, 'f0');
	queue.showQueue();
	console.log("SIZE: ", queue.getSize())

	queue.push(2, 'f2');
	queue.showQueue();
	console.log("SIZE: ", queue.getSize())

	queue.push(1, 'f1');
	queue.showQueue();
	console.log("SIZE: ", queue.getSize())


	var x = queue.pop();
	console.log("POP \nPriority: ", x[0], " / Data: ", x[1]);

	console.log("After pop: ");
	queue.showQueue();

	console.log("Adding 0 to queue");
	queue.push(0, 'f1');
	queue.showQueue();

	console.log("Adding duplicate 0 & 1");
	queue.push(0, 'dupe');

	queue.push(2, 'dupe2');
	queue.showQueue();

	console.log("Adding to the end of the list");
	queue.push(3, 'f3');
	queue.showQueue();
	console.log("SIZE:", queue.getSize())


	console.log("Popping three");
	queue.pop();
	queue.pop();
	queue.pop();
	queue.showQueue();
	console.log("SIZE:", queue.getSize())

}