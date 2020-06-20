let bodyParser = require('body-parser');
let mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0-fldrz.mongodb.net/todos?retryWrites=true&w=majority');

//create a schema - this is like a blueprint for out data

let todoSchema = new mongoose.Schema({
    item: String
});

let Todo = mongoose.model('Todo', todoSchema);



//let data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];

var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function(app) {
    app.get('/todo', function(req, res){
        //get data from mongodb and pass it to the view
        Todo.find({}, function(err, data){
            if (err) throw err;
            res.render('todo', {todos: data});

        });
      
    }); 

    app.post('/todo',urlencodedParser, function(req, res){

        //get data from the view and pass it to mongodb
        let newTodo = Todo(req.body).save(function(err,data){
            if (err) throw err;
            res.json(data)
        });

    });

    app.delete('/todo/:item', function(req, res){
        //delete requested item from mongodb

        Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err, data){
            if (err) throw err;
            res.json(data);
        });
       
    });
};