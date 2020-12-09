class node{
	//x - priority
	//obj - data object
	constructor(x, obj){
		this.data = [x, obj]
		this.next = null
	}
}

class priQ{
	constructor(){
		//have a node
		this.front = null;

		//have a size function
		this.size = 0;

		//cursor
		this.cursor = null;
	}

	push(x, obj){
		//When empty
		if(this.size == 0){
			this.front = new node(x, obj);
			this.cursor = this.front;
			this.size += 1;
		}
		//when not empty go through checking where we need to replace
		else{
			var tail = this.front;
			var head = this.front;
			while(head != null){
				//If at new data will be new head
				if(head.data[0] > x && head.data == this.front.data){
					tail = new node(x, obj);
					tail.next = head;
					this.front = tail;
					this.cursor = tail;
					this.size += 1;
					return;
				}
				//If need to replace in middle of list
				else if(head.data[0] > x){
					tail.next = new node(x, obj);
					tail = tail.next;
					tail.next = head;
					this.size += 1;
					return;
				}	
				else if(head.next == null){
					head.next = new node(x, obj);
					this.size += 1;
					return;
				}

				//If starting out in list then only move head forward
				if(head.data == this.front.data){
					head = head.next;
				}
				else{
					head = head.next;
					tail = tail.next;
				}
			}
			
		}
	}

	pop(){
		if(this.front != null){
			var tmp = this.front.data;
			this.front = this.front.next
			this.cursor = this.front;
			this.size -= 1;
			return tmp;
		}
		else{
			console.log("Error: no values in the list. Returning null.")
			return null
		}
	}

	//sets cursor to the front
	setFront(){
		this.cursor = this.front;
	}

	getSize(){
		return this.size;
	}

	showQueue(){
		//console.log("head: ", this.front.data);
		//console.log("cursor: ", this.cursor.data);
		var tmp = this.cursor;
		while(tmp != null){
			console.log("Priority: ", tmp.data[0], " / Data: ", tmp.data[1]);
			tmp = tmp.next;
		}
	}
}