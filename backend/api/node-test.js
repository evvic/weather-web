const https = require('https');

https
  .get('https://jsonplaceholder.typicode.com/todos/1', response => {
    let todo = '';

    response.on('data', chunk => {
      todo += chunk;
    });

    response.on('end', () => {
      console.log(`The title is "${JSON.parse(todo).title}"`);
    });
  })
  .on('error', error => {
    console.error('Error: ' + error.message);
  });