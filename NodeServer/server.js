var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Start server on port 8081
// It is important to start Node on a different port
var port = 8081;

var router = express.Router();

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/courses');

var Course     = require('./models/courses');

var cors = require('cors')

app.use(cors()) 

router.use(function(req, res, next) {
    console.log('Something is happening');
    next();
});

// GET request to /api returns { message: 'Hello World' }
// In my C9 account the request must be sent to https://node-angular-lgobinath.c9users.io:8081/api
router.get('/', function(req, res) {
    res.json({ message: 'Hello World' });
});

router.route('/courses')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var course = new Course();      // create a new instance of the Bear model
        course.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        course.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Course created!' });
        });

    })
    .delete(function(req, res){
        Course.remove({}, function(err, course){
                if(err)
                  res.send(err)
                  
                res.json({message: 'All courses removed'})
        });
                
    })
    
        .get(function(req, res) {
        Course.find(function(err, courses) {
            if (err)
                res.send(err);

            res.json(courses);
        });
    });
router.route('/courses/:course_id')

    .delete(function(req, res) {
        Course.remove({
            _id: req.params.course_id
        }, function(err, course) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Server is running on port ' + port)