'use strict';

(function () {

  /**
   * Creates a new sequence function.
   * @return {function(): number} A function that returns sequences of numbers on each call
   */
  function sequencer() {
    let i = 1;
    return function () {
      const n = i;
      i++;
      return n;
    }
  }

  /**
   * An event handler that keeps track of the callback reference added
   * to an HTML element using `addEventListener` and removed with
   * `removeEventListener`.
   */
  class Handler {
    /**
     * Instances a new `Handler` and registers the `callback` function
     * for the specified `event` at the `element` level.
     * @param event {string} The event name
     * @param element {HTMLElement} An HTML element
     * @param callback {Function} The function to be invoked on `event`
     */
    constructor(event, element, callback) {
      this._event = event;
      this._element = element;
      this._callback = callback;
      this._element.addEventListener(this._event, this._callback);
    }

    //@formatter:off
    get event() { return this._event; }
    get element() { return this._element; }
    get callback() { return this._callback; }
    //@formatter:on

    /**
     * Unregisters this handler.
		Ovveri rimuove gli evListener associati ai bottoni dei task rimossi
     */
    unregister() {
      this._element.removeEventListener(this._event, this._callback);
    }
  }

  /**
   * An entity that is able to emit events certain subscribers are
   * interested into.
   */
  class EventEmitter {
    constructor() {
      this._subscribers = [];
      this._seq = sequencer();
    }

    /**
     * Adds a new subscriber for the specified event.
     * @param event
     * @param callback
     */
    on(event, callback) {
      const id = this._seq();
      this._subscribers.push({id, event, callback});
      return {
        unsubscribe: this._unsubscribe.bind(this)
      };
    }

    _unsubscribe(anId) {
      const j = this._subscribers.findIndex(s => s.id === anId);
      if (j >= 0) {
        this._subscribers.splice(j, 1);
      }
    }

    /**
     * Emits an event. This immediately triggers any callback that has
     * been subscribed for the exact same event.
     * @param event {string} The event name
     * @param data {Object?} Any additional data passed to the callback.
     */
    emit(event, data) {
      this._subscribers
        .filter(s => s.event === event)
        .forEach(s => s.callback(data));
    }
  }

  /**
   * A project.
   */
  class ProjectModel {
    constructor(id, projectName) {
      this._id = id;
      this._projectName = projectName;
    }

    //@formatter:off
    get id() { return this._id; }
    set id(id) { this._id = id; }
    get projectName() { return this._projectName; }
    set projectName(projectName) { this._projectName = projectName; }
    //@formatter:on
  }

  /**
   * A data.
   */
   class DataModel {
	  
    constructor(id, projectid, fields, user) {
      this._id = id;
      this._projectid = projectid;
      this._fields = fields;
      this._user = user;
      this._timestamp = new Date();
    }

    //@formatter:off
    get id() { return this._id; }
    set id(id) { this._id = id; }

    get projectid() { return this._projectid; }
    set projectid(projectid) { this._projectid = projectid; }

    get fields() { return this._fields; }
    set fields(fields) { this._fields = fields; }

    get user() { return this._user; }
    set user(user) { this._user = user; }

    get timestamp() { return this._timestamp; }
    set timestamp(ts) { this._timestamp = ts; }
    //@formatter:on
  }

  /**
   * A data.
   */
   class UserModel {
	  
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

  function endRemoveAndTrim(str, char) {
    if (str) {
      str = str.trimRight();
      while (str && str[str.length - 1] === char) {
        str = str.substr(0, str.length - 1).trimRight();
      }
    }
    return str;
  }

  function startRemoveAndTrim(str, char) {
    if (str) {
      str = str.trimLeft();
      while (str && str[0] === char) {
        str = str.substr(1, str.length - 1).trimLeft();
      }
    }
    return str;
  }

  function mkUrl(baseUrl, path, queryParams) {
    const bu = endRemoveAndTrim((baseUrl || '').trim(), '/');
    const p = startRemoveAndTrim(path.trim(), '/');
    let url = [bu, p].join('/');
    if (queryParams && typeof queryParams === 'object') {
      const params = [];
      for (let key of Object.keys(queryParams)) {
        const k = encodeURIComponent(key);
        const val = queryParams[key];
        if (val) {
          let v = encodeURIComponent(val);
          params.push(`${k}=${v}`);
        } else {
          params.push(k)
        }
      }
      if (params.length) {
        url += '?' + params.join('&');
      }
    }

    return url;
  }

  function handleJsonResponse(req, resolve, reject) {
    if (req.readyState === XMLHttpRequest.DONE) {
      // Everything is good, the response was received.
      if (req.status === 200 || req.status === 201) {
        const hdr = req.getResponseHeader('Content-type');
        if (hdr.substr(0, 16) === 'application/json' || hdr.substr(0, 9) === 'text/json') {
          resolve(JSON.parse(req.responseText));
        } else {
          const e = new Error('Not a JSON response');
          e.status = req.status;
          e.response = req.responseText;
          reject(e);
        }
      } else {
        const hdr = req.getResponseHeader('Content-type');
        const e = new Error('Operation failed');
        e.status = req.status;
        if (hdr === 'application/json' || hdr === 'text/json') {
          e.json = JSON.parse(req.responseText);
        } else {
          e.response = req.responseText;
        }
        var erroreMessage = JSON.parse(req.responseText);
        alert(erroreMessage.error);
        
        reject(e);
      }
    }
  }

  function setHeaders(req, headers) {
    if (headers && typeof headers === 'object') {
      for (let key of Object.keys(headers)) {
        req.setRequestHeader(key, headers[key]);
      }
    }
  }

  /**
   * A minimal AJAX client for RESTful APIs.
   */
  class RestClient {
    /**
     * Instances a new `RestClient`.
     * @param baseUrl {string?} Optional baseUrl
     */
    constructor(baseUrl) {
      this._baseUrl = baseUrl;
    }

    /**
     * Sends an AJAX request for the specified `method`.
     * @param method {'GET'|'POST'|'PUT'|'DELETE'} HTTP method
     * @param path {string} The URL path to be appended to this `baseUrl`
     * @param body {Object?} Optional body of the message, will be converted to JSON if present
     * @param queryParams {Object?} Optional query parameters
     * @param headers {Object?} Optional headers
     * @return {Promise} A promise of the JSON response.
     * @private
     */
    _send(method, path, body, queryParams, headers) {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();

        // prepares the response handler
        req.onreadystatechange = () => handleJsonResponse(req, resolve, reject);
        req.open(method, mkUrl(this._baseUrl, path, queryParams));

        // populates additional headers
        setHeaders(req, headers);

        // send request
        if (body) {
          req.setRequestHeader('Content-Type', 'application/json');
          req.send(JSON.stringify(body));
        } else {
          req.send();
        }
      });
    }

    /**
     * Sends a GET request.
     * @param path {string} URL path to be appended to base URL.
     * @param queryParams {Object?} Optional query parameters
     * @param headers {Object?} Optional headers
     * @return {Promise} A promise of the JSON response.
     */
    get(path, queryParams, headers) {
      return this._send('GET', path, null, queryParams, headers);
    }

    /**
     * Sends a POST request.
     * @param path {string} URL path to be appended to base URL.
     * @param body {Object?} Optional body of the message, will be converted to JSON if present
     * @param queryParams {Object?} Optional query parameters
     * @param headers {Object?} Optional headers
     * @return {Promise} A promise of the JSON response.
     */
    post(path, body, queryParams, headers) {
      return this._send('POST', path, body, queryParams, headers);
    }

    /**
     * Sends a PUT request.
     * @param path {string} URL path to be appended to base URL.
     * @param body {Object?} Optional body of the message, will be converted to JSON if present
     * @param queryParams {Object?} Optional query parameters
     * @param headers {Object?} Optional headers
     * @return {Promise} A promise of the JSON response.
     */
    put(path, body, queryParams, headers) {
      return this._send('PUT', path, body, queryParams, headers);
    }

    /**
     * Sends a DELETE request.
     * @param path {string} URL path to be appended to base URL.
     * @param queryParams {Object?} Optional query parameters
     * @param headers {Object?} Optional headers
     * @return {Promise} A promise of the JSON response.
     */
    del(path, queryParams, headers) {
      return this._send('DELETE', path, null, queryParams, headers);
    }
  }

  /**
   * A user that can be synchronized with the REST API.
   */
   class RestUserModel extends UserModel {
    /**
     * Instances a new `RestTaskModel`.
     * @param username {string} Username
     * @param password {string} password
     * @param client {RestClient} A rest client
     */
    constructor(username, password, client) {
      super(username, password); //chiama il costruttore del padre
      this._client = client;
    }
	
	/*
	 Dto = Data Transfer Object
	 oggetto scambiato nelle comunicazioni
	*/
    toDto() {
      return {username: this.username, password: this.password};
    }
	
	/*
		Invio il nuovo task al server tramite post
		ritorno l'oggetto this
	*/
    async create() {
      let dto = this.toDto();
      dto = await this._client.post('signup', dto); //invio al server dto(=il nuovo task con id(=null),desc e timestamp)
      this.username = dto.username;
      this.password = dto.password;
      return this;
    }
	
  }

  const tasks = [];
  const client = new RestClient('/api');


  /**
   *  Funzione per il login da implementare con servers
   */
  async function signup(){
    console.log("Starting signup process...");
    const inpUser = document.getElementById("user");
    const user = (inpUser.value || '').trim();
    inpUser.value = '';

    const inpPsw = document.getElementById("pass");
    const psw = (inpPsw.value || '').trim();
    inpPsw.value = '';

    const userModel = new RestUserModel(user, psw, client);
    console.log(`Saving new user '${userModel.username}' ...`);
    
    await userModel.create();
    console.log('User successfully saved', {userModel: userModel.toDto()});
  }



  async function init() {

    const signupBtn = document.getElementById("btn-signup");
    signupBtn.addEventListener('click', signup); //funzione di signup
    
  }


  init();

})();
