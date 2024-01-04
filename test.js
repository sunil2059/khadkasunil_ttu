const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse POST data
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit_test', (req, res) => {
  // Access form data
  let q1Answer = req.body.q1;
  let q2Answer = req.body.q2;

  // Check answers
  let q1Correct = (q1Answer === 'kathmandu');
  let q2Correct = (q2Answer === 'rupee');

  // Calculate score
  let score = 0;
  if (q1Correct) score++;
  if (q2Correct) score++;

  // Send response
  res.send(`Your score is ${score} out of 2.`);
});

app.listen(3000, () => console.log('Server started on port 3000'));
