'use strict';

function showProject() {
  const selected = document.querySelector('input[type="radio"]:checked');
  if(selected == null){
    alert("Seleziona un progetto.");
    return;
  }
  document.querySelector(".home-page").setAttribute("hidden", true);

  document.querySelector(".data-page").removeAttribute("hidden");

  const h1 = document.getElementById("projectname");

  h1.textContent = "Progetto: "+ selected.getAttribute("class");
  

  //Dati che copieremo dal DB
  const data = [[123,"Cane", "5kg", "10m", "user1", 12.30],
    [456, "Gatto", "5kg", "10m", "user2", 10.30]
  ]; //in project inseriremo i dati recuperati dal server

  
  //Per ogni progetto recuperato inseriamo nella tabella i valori
  for(var i=0; i<data.length; i++){
    const tbody = document.querySelector('#databody');
    const tr = document.createElement('tr');
    
    tr.setAttribute("id", data[i][0]);
    tbody.appendChild(tr);
    
    var td = document.createElement('td');
    td.innerHTML = "<input type='radio' id="+ data[i][0] + " name='data' class=" + data[i][1] + " >";
    tr.appendChild(td);

    for(var j=0; j<data[0].length; j++){
      if(j<1){
        td = document.createElement('th');
      }
      else{
        td = document.createElement('td');  
      }
      td.textContent = data[i][j];
      tr.appendChild(td);
    }
  }

  const deleteBtn = document.getElementById("btn-delete-data");
  deleteBtn.addEventListener('click', deleteElem);

  const createBtn = document.getElementById("btn-create-data");
  createBtn.addEventListener('click', createData);
}

function insertData(){ 
  document.getElementById("insert-data").setAttribute("hidden", true);

  const data = document.querySelectorAll(".new-data-info");
  console.log(data[0].value);
  console.log(data[1].value);
  console.log(data[2].value);
  console.log(data[3].value);
  const user = "new-user"; //leggi il nome utente
  const orario = 17.40;

  const tbody = document.querySelector('#databody');
  const tr = document.createElement('tr');
  
  tr.setAttribute("id", data[0].value);
  tbody.appendChild(tr);
  
  var td = document.createElement('td');
  td.innerHTML = "<input type='radio' id="+ data[0].value + " name='data' class=" + data[1].value + " >";
  tr.appendChild(td);

  for(var j=0; j<data.length+2; j++){
    if(j<1){
      td = document.createElement('th');
    }
    else{
      td = document.createElement('td');  
    }
    if(j<data.length){
      td.textContent = data[j].value;
    }
    else if(j==data.length){ 
      td.textContent=user;
    }
    else{ 
      td.textContent=orario;
    }
    tr.appendChild(td);
  }
}

function createData(){
  document.getElementById("insert-data").removeAttribute("hidden");
  
  const insertBtn = document.getElementById("btn-insert-data");
  insertBtn.addEventListener('click', insertData);
}

function deleteElem() {
  const selected = document.querySelector('input[type="radio"]:checked');
  
  if(selected == null){
    alert("Seleziona un progetto.");
    return;
  }
  
  console.log("Cancello progetto " + selected.getAttribute("id"));

  const id = selected.getAttribute("id");

  const rowToDelete = document.getElementById(id);

  //Come cancellare su html
  rowToDelete.remove();

}

function insertProject() {
  document.querySelector(".new-page").setAttribute("hidden", true);

  const id = document.getElementById("projectid").value;
  const name = document.getElementById("projectname").value;
  const fields = document.getElementById("fields").value;
  const user = "new-user"; //leggi il nome utente
  const orario = 17.40;

  const tbody = document.querySelector('#projectbody');
  const tr = document.createElement('tr');
  
  tr.setAttribute("id", id);
  tbody.appendChild(tr);
  
  var td = document.createElement('td');
  td.innerHTML = "<input type='radio' id="+ id + " name='data' class=" + name + " >";
  tr.appendChild(td);

  for(var j=0; j<4; j++){
    if(j<2){
      td = document.createElement('th');
      if(j==0){
        td.textContent = id;
      }
      else{
        td.textContent = name;
      }
    }
    else{
      td = document.createElement('td');  
      if(j==2){
        td.textContent=user;
      }
      else{
        td.textContent=orario;
      }
    }
    tr.appendChild(td);
  }
}

// Da implementare nella homepage invece che in una diversa
function createProject() {
  console.log("crea progetto");

  document.querySelector(".new-page").removeAttribute("hidden");

  const insertBtn = document.getElementById("btn-insert-project");
  insertBtn.addEventListener('click', insertProject);
  
}

function mainPage(){
  document.querySelector(".home-page").removeAttribute("hidden");

  /**
   * Contatto il server con GET e recupero:
   * ID dei progetti, utente ultima modifica, ultima modifica
   * 
   * Devo riempire la tabella 
   */
  const projects = [[123,"Animali", "user1", 12.30],
    [456, "Auto", "user2", 10.30],
    [789, "Scarpe", "user3", 9.30]
  ]; //in project inseriremo i dati recuperati dal server

  
  //Per ogni progetto recuperato inseriamo nella tabella i valori
  for(var i=0; i<projects.length; i++){
    const tbody = document.querySelector('#projectbody');
    const tr = document.createElement('tr');
    
    tr.setAttribute("id", projects[i][0]);
    tbody.appendChild(tr);
    
    var td = document.createElement('td');
    td.innerHTML = "<input type='radio' id="+ projects[i][0] + " name='project' class=" + projects[i][1] + " >";
    tr.appendChild(td);

    for(var j=0; j<projects[0].length; j++){
      if(j<2){
        td = document.createElement('th');
      }
      else{
        td = document.createElement('td');  
      }
      td.textContent = projects[i][j];
      tr.appendChild(td);
    }
    
  }

  const updateBtn = document.getElementById("btn-update-project");
  updateBtn.addEventListener('click', showProject);

  const createBtn = document.getElementById("btn-create-project");
  createBtn.addEventListener('click', createProject);

  const deleteBtn = document.getElementById("btn-delete-project");
  deleteBtn.addEventListener('click', deleteElem);
}

/**
 * Funzione di associata al click sul bottone di Login
 * nella pagina iniziale.
 * questa sarà una get
 */
function login(){
  const inpUser = document.getElementById("user");
  //const user = (inpUser.value || '').trim();
  
  const inpPsw = document.getElementById("pass");
  //const psw = (inpPsw.value || '').trim();

  inpUser.value = "";
  inpPsw.value = "";

  // if(user=='' || psw==''){
  //   alert("Inserisci user e password.");
  //   return;
  // }
  
  /**
   * Mi dovrò collegare al server per valutare
   * se user e password sono presenti nel DB.
  */
  var checked = true;
  /**
   * Se user,password OK => home-page
   * altrimenti msg di errore
   */
  if(checked){
    document.querySelector(".login-page").setAttribute("hidden", true);
    mainPage();
  }
  else{
    alert("Non sei registrato, registrati.");
  }
  

}

/**
 * Questa sarà un richiesta di POST sul server
 */
function signup(){
  const inpUser = document.getElementById("user");
  const user = (inpUser.value || '').trim();
  
  const inpPsw = document.getElementById("pass");
  const psw = (inpPsw.value || '').trim();

  inpUser.value = "";
  inpPsw.value = "";
  /*
    Qui inserisco dati nel db
    se inseriti correttamente allora mando messaggio
  */
}


function init() {
  const loginBtn = document.getElementById("btn-login");
  const signupBtn = document.getElementById("btn-signup");

  if(!loginBtn){
    console.log("Errore form non caricata.");
  }

  loginBtn.addEventListener('click', login);
  signupBtn.addEventListener('click', signup);

  
}

init();