// structs --------------------------------------------------------------------

// private NodeObj type
typedef struct NodeObj{
   int data;
   struct NodeObj* next;
} NodeObj;

// private Node type
typedef NodeObj* Node;

// private QueueObj type
typedef struct QueueObj{
   Node front;
   Node back;
   int length;
} QueueObj;


// Constructors-Destructors ---------------------------------------------------

// newNode()
// Returns reference to new Node object. Initializes next and data fields.
// Private.
Node newNode(int data){
   Node N = malloc(sizeof(NodeObj));
   N->data = data;
   N->next = NULL;
   return(N);
}

// freeNode()
// Frees heap memory pointed to by *pN, sets *pN to NULL.
// Private.
void freeNode(Node* pN){
   if( pN!=NULL && *pN!=NULL ){
      free(*pN);
      *pN = NULL;
   }
}

// newQueue()
// Returns reference to new empty Queue object.
Queue newQueue(void){
   Queue Q;
   Q = malloc(sizeof(QueueObj));
   Q->front = Q->back = NULL;
   Q->length = 0;
   return(Q);
}


// freeQueue()
// Frees all heap memory associated with Queue *pQ, and sets *pQ to NULL.S
void freeQueue(Queue* pQ){
   if(pQ!=NULL && *pQ!=NULL) { 
      while( !isEmpty(*pQ) ) { 
         Dequeue(*pQ); 
      }
      free(*pQ);
      *pQ = NULL;
   }
}