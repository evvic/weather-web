const Koa = require('koa')
const Router = require('koa-router')
const {
  Pool
} = require('pg')
const koaBody = require('koa-bodyparser')()
const cors = require('kcors')

// db pool
const pool = new Pool({
  user: 'weather',
  host: 'db',
  database: 'weather_db',
  password: 'weather',
})

// The port that this server will run on, defaults to 9000
const port = process.env.PORT || 9000
// Instantiate a Koa server
const app = new Koa()
app.use(cors())

// Instantiate routers
const weather = new Router()

// Define API path
const apiPath = '/v1'
const weatherPath = `${apiPath}/weather`

// async/await - check out a client
weather.get(apiPath, async (ctx) => {
  const client = await pool.connect()
  try {
    const data = await client.query('SELECT NOW() as now')
    client.release()
    // Tell the HTTP response that it contains JSON data encoded in UTF-8
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  }
})


/////////////////////////////////////////////////////////////////
//      Personal endpoints starts - ewic
/////////////////////////////////////////////////////////////////

// get last 50
weather.get(`${weatherPath}/last50`, async (ctx) => {
  const client = await pool.connect();
  console.log("Loading last 50...");
  try {
    const sql = `SELECT device_id, date_time, data from weather ORDER BY id DESC LIMIT 50`;
    const data = await client.query(sql);
    ctx.type = 'application/json; charset=utf-8';
    ctx.body = data.rows;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  } finally {
    client.release(); // release client back to pool
  }
});

// get latest wind_speed
weather.get(`${weatherPath}/latest/wind_speed`, async (ctx) => {
  const client = await pool.connect();
  console.log("Loading latest wind speed...");
  try {
    //CHNAGE SQL TO WIND SPEED
    const sql = 
    `SELECT device_id, date_time, data from weather
    where data->>'wind_speed' is not null
    ORDER BY id DESC LIMIT 1`;
    const data = await client.query(sql);
    ctx.type = 'application/json; charset=utf-8';
    ctx.body = data.rows;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  } finally {
    client.release(); // release client back to pool
  }
});

// get latest 20 wind_speed
weather.get(`${weatherPath}/wind_speed`, async (ctx) => {
  const client = await pool.connect();
  console.log("Loading last 20 wind speeds...");
  try {
    const sql = 
    `SELECT device_id, date_time, data from weather
    where data->>'wind_speed' is not null
    ORDER BY id DESC LIMIT 20`;
    const data = await client.query(sql);
    ctx.type = 'application/json; charset=utf-8';
    ctx.body = data.rows;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  } finally {
    client.release(); // release client back to pool
  }
});

// get avg signal data of wind_speed for last 24 hours
weather.get(`${weatherPath}/wind_speed/24`, async (ctx) => {
  const client = await pool.connect();
  console.log("Loading average wind_speed from last 24 hours...");

  try {
    const sql = 
    `SELECT round(avg((data->>'wind_speed')::numeric),2) avg_wind_speed
    from weather
    where date_time >= NOW() - '1 day'::INTERVAL`; //I'm proud of myself for this one
    const data = await client.query(sql);
    ctx.type = 'application/json; charset=utf-8';
    ctx.body = data.rows;
  } catch (error) {
    console.error('Error occurred:', error);
    ctx.throw(500, error);
  } finally {
    client.release(); // release client back to pool
  }
});

/////////////////////////////////////////////////////////////////
//      Personal endpoints ends
/////////////////////////////////////////////////////////////////

// get 500
weather.get(weatherPath, async (ctx) => {
  const client = await pool.connect()
  try {
    const data = await client.query('SELECT id, device_id, date_time, data from weather ORDER BY id DESC LIMIT 500')
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// get n
weather.get(`${weatherPath}/limit/:num`, async (ctx) => {
  const client = await pool.connect()
  let {
    num
  } = ctx.params
  if (num > 1000 || num === null) {
    num = 500
  }
  try {
    const sql = `SELECT id, device_id, date_time, data from weather ORDER BY id DESC LIMIT ${num}`
    const data = await client.query(sql)
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})


// get all measurement names
weather.get(`${weatherPath}/names`, async (ctx) => {
  const client = await pool.connect()
  try {
    const sql = `
      SELECT DISTINCT name
      FROM (
          SELECT id, jsonb_object_keys(data) AS name FROM weather 
          ORDER BY id DESC LIMIT 500
      ) AS subquery
      ORDER BY name`

    const data = await client.query(sql)
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// get latest
weather.get(`${weatherPath}/latest`, async (ctx) => {
  const client = await pool.connect()
  try {
    const data = await client.query('SELECT id, device_id, date_time, data from weather ORDER BY id DESC LIMIT 1')
    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// get latest by key
//Internal Server Error
weather.get(`${weatherPath}/latest/:key`, async (ctx) => {
  const {
    key
  } = ctx.params
  const client = await pool.connect()
  try {
    const sql = `
    SELECT id, device_id, date_time, data ->> '${key}' as "${key}"
    FROM weather WHERE data ->> '${key}' is not null ORDER BY id DESC LIMIT 1`
    const data = await client.query(sql)

    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// get by key
weather.get(`${weatherPath}/:key`, async (ctx) => {
  const {
    key
  } = ctx.params
  const client = await pool.connect()
  try {
    const sql = `
      SELECT * FROM(SELECT device_id, date_time, data ->> '${key}' as "${key}"
        FROM weather where data ->> '${key}' is not null
        ORDER BY id DESC LIMIT 20) AS data
      ORDER BY date_time ASC`
    const data = await client.query(sql)

    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// get by key and interval
//Internal Server Error
weather.get(`${weatherPath}/:key/:interval`, async (ctx) => {
  const {
    key,
    interval
  } = ctx.params
  console.log('key: ' + key)
  const client = await pool.connect()
  try {
    const sql = `
      SELECT date_trunc('hour', date_time) as date_time, round(avg((data ->> '${key}')::numeric),2) as "${key}"
      FROM weather WHERE date_time > NOW() - INTERVAL '${interval} hours'
      AND data ->> '${key}' is not null
      group by date_trunc('hour', date_time)
      ORDER BY date_time ASC
      `
    const data = await client.query(sql)

    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// average by key
weather.get(`${weatherPath}/stat/avg/:key`, async (ctx) => {
  const {
    key
  } = ctx.params
  const client = await pool.connect()
  try {
    const sql = `SELECT round(avg((data->>'${key}')::numeric), 2) as avg from weather`
    const data = await client.query(sql)

    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// min by key
weather.get(`${weatherPath}/stat/min/:key`, async (ctx) => {
  const {
    key
  } = ctx.params
  const client = await pool.connect()
  try {
    const sql = `SELECT min(data->>'${key}') from weather`
    const data = await client.query(sql)

    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// max by key
weather.get(`${weatherPath}/stat/max/:key`, async (ctx) => {
  const {
    key
  } = ctx.params
  const client = await pool.connect()
  try {
    const sql = `SELECT max((data->>'${key}')::numeric) from weather`
    const data = await client.query(sql)

    ctx.type = 'application/json; charset=utf-8'
    ctx.body = data.rows
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

// insert new data
weather.post(weatherPath, koaBody, async (ctx) => {
  const {
    device_id
  } = ctx.request.body
  const data = ctx.request.body.data

  const sql = 'INSERT INTO weather(device_id, data) VALUES($1, $2)'
  const values = [device_id, data]

  const client = await pool.connect()
  try {
    await client.query(sql, values)
    ctx.type = 'application/json; charset=utf-8'
    ctx.status = 201
  } catch (error) {
    console.error('Error occurred:', error)
    ctx.throw(500, error)
  } finally {
    client.release() // release client back to pool
  }
})

app.use(weather.routes())
app.use(weather.allowedMethods())

// Start the server and keep listening on port until stopped
app.listen(port)

console.log(`App listening on port ${port}`)