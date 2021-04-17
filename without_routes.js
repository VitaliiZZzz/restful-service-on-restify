const restify = require('restify');
const port = process.env.PORT || 8080;
const app = restify.createServer();

app.use(restify.plugins.bodyParser());
app.use(logger);

const books = [
	{id: 1, name: 'book1'},
	{id: 2, name: 'book2'},
	{id: 3, name: 'book3'}
];

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.get('/api/books', (req, res) => {
	res.send(books);
});

app.get('/api/books/:id', (req, res) => {
	const book = books.find(b => b.id === parseInt(req.params.id));
	if (!book) {
		res.status(404);
		res.send('The book with given id is not found');
	}else
	res.send(book);
});

app.post('/api/books', (req, res) => {
	if (!req.body.name || req.body.name.length < 3){
		// 400 Bad Request
		res.status(400);
		res.send('Name is required and should be minimum characters');
		return;
	}

	const book = {
		id: books.length + 1,
		name: req.body.name 
	}
	books.push(book);
	res.send(book);
});

app.put('/api/books/:id', (req, res) => {
	const book = books.find(b => b.id === parseInt(req.params.id));
	if (!book) {
		res.status(404);
		res.send('The book with given id is not found');
		return;
	};
	if (!req.body.name){
		// 400 Bad Request
		res.status(400);
		res.send('You should give book name');
		return;
	}else{
		book.name = req.body.name;
		res.send(book);
	}
});

app.del('/api/books/:id', (req, res) => {
	const book = books.find(b => b.id === parseInt(req.params.id));
	if (!book) {
		res.status(404);
		res.send('The book with given id is not found');
		return;
	};
	const index = books.indexOf(book);
	books.splice(index, 1);
	res.send(book);
});

function logger(req, res, next){
	console.log("Middleware request on restify");
	next();
};

app.listen(port, () => {
	console.log(`Listening port ${port}...`);
});
