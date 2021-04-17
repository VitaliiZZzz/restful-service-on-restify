const Router = require('restify-router').Router;
const restify = require('restify');
const routerInstance = new Router();
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

routerInstance.group('/api/books', function(router){
	router.get('/', (req, res) => {
		res.send(books);
	});
	router.post('/', (req, res) => {
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
	routerInstance.group('/:id', function(router){
		router.get('/', (req, res) => {
			const book = books.find(b => b.id === parseInt(req.params.id));
			if (!book) {
				res.status(404);
				res.send('The book with given id is not found');
			}else
			res.send(book);
		});
		router.put('/', (req, res) => {
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
		router.del('/', (req, res) => {
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
	});
});


function logger(req, res, next){
	console.log("Middleware request on restify");
	next();
};

routerInstance.applyRoutes(app);

app.listen(port, () => {
	console.log(`Listening port ${port}...`);
});
