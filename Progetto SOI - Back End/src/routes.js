'use strict';

function sequencer() {
    let i = 1;
    return function () {
        const n = i;
        i++;
        return n;
    }
}

class Project {
    constructor(id, projectName) {
        this._id = id;
        this._projectName = projectName;
    }

    //@formatter:off
    get id() { return this._id; }
    get projectName() { return this._projectName; }
    set projectName(projectName) { this._projectName = projectName; }
    //@formatter:on
}

class Data {
    constructor(id, projectid, fields, user) {
        this._id = id;
		this._projectid = projectid;
        this._fields = fields;
		this._user = user;
		this._timestamp = new Date();

    }

    //@formatter:off
    get id() { return this._id; }
	
	get projectid() { return this._projectid; }
    set projectid(projectid) { this._projectid = projectid; }
	
	get fields() { return this._fields; }
    set fields(fields) { this._fields = fields; }
	
    get user() { return this._user; }
    set user(user) { this._user = user; }
	
	get timestamp() { return this._timestamp; }
    //@formatter:on
}

class User {
    constructor(username, password) {
		this._username = username;
		this._password = password;
    }

    //@formatter:off
	get username() { return this._username; }
    set username(username) { this._username = username; }

    get password() { return this._password; }
    set password(password) { this._password = password; }
    //@formatter:on
}

const seq = sequencer();
const projects = [];
const users = [];
const data = [];

for (let i = 0; i < 5; i++) {
    const id = seq();
    projects.push(new Project(id, `Progetto #${id}`));
	users.push(new User(`user#${id}`, `pass#${id}`));	
}

/*
function toDTO(task) {
    return {
        id: task.id,
        description: task.description,
        timestamp: task.timestamp // should be converted according to ISO8601
    };
}
*/

function userToDTO(user) {
    return {
        username: user.username,
        password: user.password
    };
}

function isNonBlank(str) {
    return typeof str === 'string' && str.trim();
}

function isInteger(n) {
    if (typeof n === 'number') {
        return true;
    }
    if (typeof n === 'string') {
        try {
            parseInt(n, 10);
            return true;
        } catch (_) {
            return false;
        }
    }
    return false;
}

function routes(app) {

	app.post('/signup', (req, resp) => {
        const {username, password} = req.body;
        console.debug(users);
        console.debug('\nAttempting to create a new user', {username});

        if (users.find(p => p.username === username)) {
        	console.debug('User already used', {username});
            resp.status(401);
            resp.json({error: 'Username alredy used'});
            return;
        }
        else if(!isNonBlank(username) || !isNonBlank(password))
        {
        	console.debug('\nThere is no username or password.');
            resp.status(401);
            resp.json({error: 'Insert a username and a valid password'});
            return;
        }

        const user = new User(username, password);
        users.push(user);
        console.info('\nUser was successfully created', {user});
		console.debug('\nRegistered users:', {username});
        resp.status(201);
        resp.json(userToDTO(user));
    });
	
	/*
	
	app.post('/signup', (req, resp) =>{
		//Recupero tutti i progetti
		// users.push(nuovo utente)
	});
	
	app.post('/login', (req, resp) =>{ ???????
		//Recupero tutti i progetti
		// users.push(nuovo utente)
	});
	
	//+++++++++++++++INIZIO OPERAZIONI SU PROGETTI+++++++++++++++
	app.get('/projects', (req, resp) =>{
		//Recupero tutti i progetti
		console.debug("GET Progetti \n");
	});
	
	app.post('/project', (req, resp) =>{
		//Aggiungo un nuovo progetto
		console.debug("POST Progetti \n");
	});
	
	app.put('/project/:id', (req, resp) =>{
		//Aggiorno il nome del progetto ANCHE NO
		console.debug("PUT Progetti \n");
	});	
	
	app.del('/project/:id', (req, resp) =>{
		//elimino il progetto scelto
		console.debug("DEL Progetti \n");
	});	
	
	//+++++++++++++++FINE OPERAZIONI SU PROGETTI+++++++++++++++
	
	//+++++++++++++++INIZIO OPERAZIONI SUI DATI+++++++++++++++
	app.get('/data/:projectid', (req, resp) =>{
		//recupero dati di un singolo progetto
	});
		
	app.post('/data', (req, resp) =>{
		//Inserisco un nuovo dato
	});
	
	app.del('/data/:id', (req, resp) =>{
		//elimino il dato scelto
	});	
	
	app.put('/data/:id', (req, resp) =>{
		//aggiorno il dato scelto
	});	
	//+++++++++++++++FINE OPERAZIONI SUI DATI+++++++++++++++
    */
}

module.exports = {routes};
