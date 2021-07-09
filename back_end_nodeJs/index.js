const express = require('express');
const { Pool } = require('pg');
const http = require('http');
const bodyParser = require('body-parser');
const io = require('socket.io')(http)
const extension = '/api/v1';

const crypto = require('crypto');

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const server = http.Server(app);
const PORT = parseInt(process.env.PORT) || 5000;

server.listen(PORT, function () {
  console.log('Listening');
});

io.on('connection', async (socket) => {
  socket.on('new-user', username => {
    connections[socket.id] = username;
  });
  socket.on('send-message-chat', async data => {
    data.userid;
    data.chatid;
    data.message;
    data.timestamp;
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM chat where user_id_1 = $1 OR user_id_2  = $1 AND id = $2', [data.userid, data.chatid])[0];
    let receiverId;

    if (result.user_id1 !== data.userid) {
      receiverId = result.user_id1;
    }
    if (result.user_id1 !== data.userid) {
      receiverId = result.user_id2;
    }

    const username = await client.query('SELECT username from users where id = $1', [receiverId])[0].username;

    client.release();

    receiverSocketId = getKeyByValue(username);

    socket.to(receiverSocketId).emit('send-message', data);
  });

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  socket.on('disconnect', () => {
    socket.emit('disconnected');
    delete connections[socket.id];
  });
  console.log('a user connected');
  socket.emit('connected');
});

app.post(`${extension}/newAddress`, async (req, res) => {
  console.log(req.body);
  const { regiondId, municipalityId, neighborhood, streetId, objectId, latitude, longitude } = req.body;
  if (!regiondId) {
    return res.status(400).send({
      success: false,
      message: 'regionId is required'
    });
  }
  if (!municipalityId) {
    return res.status(400).send({
      success: false,
      message: 'municipalityId is required'
    });
  }
  if (!neighborhood) {
    return res.status(400).send({
      success: false,
      message: 'neighborhood is required'
    });
  }
  if (!streetId) {
    return res.status(400).send({
      success: false,
      message: 'streetId is required'
    });
  }
  if (!objectId) {
    return res.status(400).send({
      success: false,
      message: 'objectId is required'
    });
  }
  if (!latitude) {
    return res.status(400).send({
      success: false,
      message: 'latitude is required'
    });
  }
  if (!longitude) {
    return res.status(400).send({
      success: false,
      message: 'longitude is required'
    });
  }


  const text = 'INSERT INTO address(region_id, municipality_id, neighborhood, street_id, object_id, latitude, longitude) VALUES ( $1, $2, $3, $4, $5, $6, $7);'
  const values = [regiondId, municipalityId, neighborhood, streetId, objectId, latitude, longitude];
  const client = await pool.connect();

  try {
    result = await client.query(text, values)
    client.release();
    return res.status(200).send({
      success: true,
      message: 'added'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.post(`${extension}/updateAddress`, async (req, res) => {
  console.log(req.body);
  const { od, regiondId, municipalityId, neighborhood, streetId, objectId, latitude, longitude } = req.body;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: 'id is required'
    });
  }
  if (!regiondId) {
    return res.status(400).send({
      success: false,
      message: 'regionId is required'
    });
  }
  if (!municipalityId) {
    return res.status(400).send({
      success: false,
      message: 'municipalityId is required'
    });
  }
  if (!neighborhood) {
    return res.status(400).send({
      success: false,
      message: 'neighborhood is required'
    });
  }
  if (!streetId) {
    return res.status(400).send({
      success: false,
      message: 'streetId is required'
    });
  }
  if (!objectId) {
    return res.status(400).send({
      success: false,
      message: 'objectId is required'
    });
  }
  if (!latitude) {
    return res.status(400).send({
      success: false,
      message: 'latitude is required'
    });
  }
  if (!longitude) {
    return res.status(400).send({
      success: false,
      message: 'longitude is required'
    });
  }

  const text = 'UPDATE public.address region_id=$2, municipality_id=$3, neighborhood=$4, street_id=$5, object_id=$6, latitude=$7, longitude=$8	WHERE id = $1;'
  const values = [id, regiondId, municipalityId, neighborhood, streetId, objectId, latitude, longitude];
  const client = await pool.connect();

  try {
    result = await client.query(text, values)
    client.release();
    return res.status(200).send({
      success: true,
      message: 'updated'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.post(`${extension}/newStreet`, async (req, res) => {
  console.log(req.body);
  const { municipalityId, country, code, name, type } = req.body;

  if (!municipalityId) {
    return res.status(400).send({
      success: false,
      message: 'municipalityId is required'
    });
  }
  if (!country) {
    return res.status(400).send({
      success: false,
      message: 'country is required'
    });
  }
  if (!code) {
    return res.status(400).send({
      success: false,
      message: 'code is required'
    });
  }
  if (!name) {
    return res.status(400).send({
      success: false,
      message: 'type is required'
    });
  }
  if (!type) {
    return res.status(400).send({
      success: false,
      message: 'type is required'
    });
  }

  const text = 'INSERT INTO street( municipality_id, country, code, name, type) VALUES ( $1, $2, $3, $4, $5);'
  const values = [municipalityId, country, code, name, type];
  const client = await pool.connect();

  try {
    result = await client.query(text, values)
    client.release();
    return res.status(200).send({
      success: true,
      message: 'added'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.post(`${extension}/updateStreet`, async (req, res) => {
  console.log(req.body);
  const { id, municipalityId, country, code, name, type } = req.body;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: 'id is required'
    });
  }

  if (!municipalityId) {
    return res.status(400).send({
      success: false,
      message: 'municipalityId is required'
    });
  }
  if (!country) {
    return res.status(400).send({
      success: false,
      message: 'country is required'
    });
  }
  if (!code) {
    return res.status(400).send({
      success: false,
      message: 'code is required'
    });
  }
  if (!name) {
    return res.status(400).send({
      success: false,
      message: 'name is required'
    });
  }
  if (!type) {
    return res.status(400).send({
      success: false,
      message: 'type is required'
    });
  }

  const text = 'UPDATE public.street SET "municipalityId"=$2, country=$3, code=$4, name=$5, type=$6 WHERE id = $1;'
  const values = [id, municipalityId, country, code, name, type];
  const client = await pool.connect();

  try {
    result = await client.query(text, values)
    client.release();
    return res.status(200).send({
      success: true,
      message: 'added'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.post(`${extension}/newObject`, async (req, res) => {
  console.log(req.body);
  const { type, numberOfFloors, numberOfEntrances } = req.body;
  if (!type) {
    return res.status(400).send({
      success: false,
      message: 'type is required'
    });
  }
  if (!numberOfFloors) {
    return res.status(400).send({
      success: false,
      message: 'numberOfFloors is required'
    });
  }
  if (!numberOfEntrances) {
    return res.status(400).send({
      success: false,
      message: 'numberOfEntrances is required'
    });
  }

  const text = 'INSERT INTO address(type, number_of_floors, number_of_entrances) VALUES ( $1, $2, $3);'
  const values = [type, numberOfFloors, numberOfEntrances];
  const client = await pool.connect();

  try {
    result = await client.query(text, values)
    client.release();
    return res.status(200).send({
      success: true,
      message: 'added'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.post(`${extension}/newObject`, async (req, res) => {
  console.log(req.body);
  const { type, numberOfFloors, numberOfEntrances } = req.body;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: 'id is required'
    });
  }
  if (!type) {
    return res.status(400).send({
      success: false,
      message: 'type is required'
    });
  }
  if (!numberOfFloors) {
    return res.status(400).send({
      success: false,
      message: 'numberOfFloors is required'
    });
  }
  if (!numberOfEntrances) {
    return res.status(400).send({
      success: false,
      message: 'numberOfEntrances is required'
    });
  }

  const text = 'UPDATE public.object  type=$2, number_of_floors=$3, number_of_entrances=$4 WHERE id = $1;'
  //const text = 'INSERT INTO address(type, number_of_floors, number_of_entrances) VALUES ( $1, $2, $3);'
  const values = [id, type, numberOfFloors, numberOfEntrances];
  const client = await pool.connect();

  try {
    result = await client.query(text, values)
    client.release();
    return res.status(200).send({
      success: true,
      message: 'added'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.post(`${extension}/login`, async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).send({
      success: false,
      message: 'email is required'
    });
  }
  if (!password) {
    return res.status(400).send({
      success: false,
      message: 'password is required'
    });
  }
  const client = await pool.connect();
  let result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, getHashedPassword(password)]);
  client.release();
  if (result.rowCount == 0) {
    return res.status(404).send({
      success: false,
      message: 'authentication failed'
    });
  }

  return res.status(200).send({
    success: true,
    message: 'authenticated',
    user: {
      id: result.rows[0].id,
      name: result.rows[0].name,
      surname: result.rows[0].surname,
      username: result.rows[0].username,
      email: result.rows[0].email,
      role: result.rows[0].role
    }
  });
});


app.post(`${extension}/register`, async (req, res) => {
  const { email, password, name, surname, username, role } = JSON.parse(req.body);
  if (!email) {
    return res.status(400).send({
      success: false,
      message: 'email is required'
    });
  }
  if (!password) {
    return res.status(400).send({
      success: false,
      message: 'password is required'
    });
  }
  if (!name) {
    return res.status(400).send({
      success: false,
      message: 'name is required'
    });
  }
  if (!surname) {
    return res.status(400).send({
      success: false,
      message: 'surname is required'
    });
  }
  if (!username) {
    return res.status(400).send({
      success: false,
      message: 'username is required'
    });
  }

  if (!role) {
    return res.status(400).send({
      success: false,
      message: 'role is required'
    });
  }

  const client = await pool.connect();
  let result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  client.release();

  if (result.rowCount > 0) {
    return res.status(409).send({
      success: false,
      message: 'email taken'
    });
  }

  client = await pool.connect();
  result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
  client.release();

  if (result.rowCount > 0) {
    return res.status(409).send({
      success: false,
      message: 'username taken'
    });
  }

  const text = 'INSERT INTO users( name, surname, password, username, email, role) VALUES ( $1, $2, $3, $4, $5, $6);'
  const values = [name, surname, getHashedPassword(password), username, email, role];

  try {
    client = await pool.connect();
    result = await client.query(text, values)
    client.release();
    console.log('aaaaa');
    return res.status(200).send({
      success: true,
      message: 'registred'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }
});

app.get(`${extension}/getAdresses`, async (req, res) => {
  console.log(req.query);
  const client = await pool.connect();
  let result = await client.query(
    'SELECT address.id , address.neighborhood, address.latitude, address.longitude,region.id as region_id, region.name as region_name, ' +
    'street.id as street_id, street.country as street_country, street.code as street_code, street.type as street_type, ' +
    'object.id as object_id, object.type as object_type, object.number_of_floors as object_number_of_floors, object.number_of_entrances as object_number_of_entrances, ' +
    'municipality.id as municipality_id,  municipality.name as municipality_name, municipality.postal_code as municipality_postal_code ' +
    'FROM address INNER JOIN region on region.id = address.region_id ' +
    'INNER JOIN street on street.id = address.street_id INNER JOIN object on object.id = address.object_id ' +
    'INNER JOIN municipality on municipality.id = address.municipality_id ; ');
  client.release();

  res.status(200).send(
    result.rows
  );
});

app.get(`${extension}/getMunicipalities`, async (req, res) => {
  const client = await pool.connect();
  let result = await client.query(" SELECT * from municipality");
  client.release();
  res.status(200).send(
    result.rows
  );
});

app.get(`${extension}/getRegions`, async (req, res) => {
  const client = await pool.connect();
  let result = await client.query(" SELECT * from region");
  client.release();
  res.status(200).send(
    result.rows
  );
});

app.get(`${extension}/getStreets`, async (req, res) => {
  const client = await pool.connect();
  let result = await client.query(" SELECT * from street");
  client.release();
  res.status(200).send(
    result.rows
  );
});

app.get(`${extension}/getObjects`, async (req, res) => {
  const client = await pool.connect();
  let result = await client.query(" SELECT * from object");
  client.release();
  res.status(200).send(
    result.rows
  );
});

app.post(`${extension}/getChatsByUserId`, async (req, res) => {
  /*
  userid
  query = "SELECT * x FROM chats where user_id_1 = userid OR user_id_2 = userid";
  
  */
  const userId = req.body;
  if (!userId) {
    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'userId is required'
      });
    }
  }

  try {
    const client = await pool.connect();
    let result = await client.query("SELECT * FROM chat where user_id_1 = $1 OR user_id_2 = $1", [userId]);
    client.release();
    return res.status(200).send({
      success: true,
      chats: result
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.get(`${extension}/getMessagesByChatId`, async (req, res) => {
  /**
   * chatid
   * return -> id, chatId , message, timestamp, senderId 
   */
  const chatId = req.body;
  if (!userId) {
    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'chatId is required'
      });
    }
  }
  const client = await pool.connect();

  try {
    let result = await client.query("SELECT * FROM chat_message where chat_id = $1", [chatId]);
    return res.status(200).send({
      success: true,
      chats: result
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

app.post(`${extension}/getUserInfoById`, async (req, res) => {
  const userid = req.body;

  if (!userid) {
    return res.status(400).send({
      success: false,
      message: 'userid is required'
    });
  }
  const text = "SELECT id, username from users where id = $1";
  const values = [userid];

  try {
    client = await pool.connect();
    result = await client.query(text, values)
    client.release();
    return res.status(200).send({
      success: true,
      user: result[0]
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }

});

//use for hosted db
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//use for local db
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'mylocaldb',
//   password: 'admin',
//   port: 5432,
// });