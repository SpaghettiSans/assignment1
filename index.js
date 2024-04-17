const express = require('express');
const mysql = require('mysql');

//Create connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chicken_runner_database'
});

const app = express();

app.use(express.json());

//Insert new users
app.post('/addUser', (req, res) => {
    const { username, score } = req.body;

    if (!username || score === undefined) {
        return res.status(400).send('Username or score missing!');
    }

    db.query('INSERT INTO user_data (username, score) VALUES (?, ?)', [username, score], (error, results) => {
        if (error) {
            return res.status(500).send('An error occurred while inserting the user data!');
        }
        res.send(`User added with ID: ${results.insertId}`);
    });
});

//Get user data
app.get('/getUsersData', (req, res) => {
    db.query('SELECT * FROM user_data', (error, results) => {
      if (error) {
        return res.status(500).send('An error occurred while retrieving the user data!');
    };
      res.json(results);
    });
  });


//Update user data
app.post('/changeUserData', (req, res) => {
    const {id, score} = req.body;

    if (!id || score === undefined) {
        return res.status(400).send('id or score missing!');
    } 

    db.query('UPDATE user_data SET score=? WHERE id =?', [score, id], (error, results) => {
        if (error) {
            return res.status(500).send('An error occured while changing data!')
        }
        res.send(`User: ${id}'s score has been changed to ${score}`)
    });
});


//Delete user
app.post('/deleteUser', (req, res) => {
    const { username } = req.body;
    db.query('DELETE FROM user_data WHERE username =?', [username], (error, results) => {
        if (error) {
            return res.status(500).send('An error occured while deleting user!');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send(`User: ${username} not found.`);
        }

        res.send(`User: ${username} has been deleted`);
    })
})


//Start-up the server
var server = app.listen(8000, () => {
    var host = server.address().address
    var port = server.address().port
    console.log("App is listening at port %s:%s", host, port);
});

