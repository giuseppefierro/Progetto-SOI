'use strict';

function insertData(){ 
  document.getElementById("insert-data").setAttribute("hidden", true);

  document.getElementById("new-data").reset();

  const data = document.querySelectorAll(".new-data-info");
  const user = "new-user"; //leggi il nome utente
  const orario = 17.40;

  
  /**
   * Una volta inviate le info del nuovo dato da inserire al server
   * ricarico la pagina del progetto con showProject()
   * Questo sotto andrà rimosso
   */

  document.getElementById("databody").innerHTML ="";
  showProject();
  /*
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
  */
}

function createData(){
  document.getElementById("insert-data").removeAttribute("hidden");
}

function deleteData() {
  const selected = document.querySelector('input[type="radio"][name="data"]:checked');
  
  if(selected == null){
    alert("Seleziona un dato.");
    return;
 }
  
  console.log("Cancello dato " + selected.getAttribute("id"));

  const id = selected.getAttribute("id");

  const rowToDelete = document.getElementById(id);

  /**
   * Dopo aver identificato il progetto da rimuovere
   * dovremo inviare la richiesta al server per rimuoverlo 
   * ed infine (no: richiamare showProject() per ricare i progetti)
   * rimuoviamo l'html relativo
   */
  //Come cancellare su html
  rowToDelete.remove();
}


function showProject() {
  //in selected recupero il progetto di cui si vuole visualizzare i dati
  const selected = document.querySelector('input[type="radio"][name="project"]:checked');
  console.log(selected);

  if(selected == null){
    alert("Seleziona un progetto.");
    return;
  }

  document.querySelector(".home-page").setAttribute("hidden", true);
  
  document.getElementById("projectbody").innerHTML = '';


  document.querySelector(".data-page").removeAttribute("hidden");


  const h1 = document.getElementById("project");

  
  h1.innerHTML = "<img class='logo' src='icon.png' width='52' alt='UniPR Logo'> Progetto: " + selected.getAttribute("class");
  console.log(selected.getAttribute("class"));
  /*
   *  Contatto il server e inserisco i dati recuperati
   *  nel div appropriato
   */

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

}

function deleteProject() {
  const selected = document.querySelector('input[type="radio"]:checked');
  
  if(selected == null){
    alert("Seleziona un progetto.");
    return;
  }
  
  console.log("Cancello progetto " + selected.getAttribute("id"));

  const id = selected.getAttribute("id");

  const rowToDelete = document.getElementById(id);

  /**
   * Dopo aver identificato il progetto da rimuovere
   * dovremo inviare la richiesta al server per rimuoverlo 
   * ed infine richiamare mainPage() per ricare i progetti
   */

  //Cancello solo su html per prova
  rowToDelete.remove();

  /**
   * document.getElementById("projectbody") = "";
   * mainPage();
   */
}

// Invio i dati del nuovo progetto da creare
// al server
function insertProject() {
  document.querySelector(".new-page").setAttribute("hidden", true);
  document.getElementById("new-project").reset();

  const id = document.getElementById("projectid").value;
  const name = document.getElementById("projectname").value;
  const fields = document.getElementById("fields").value;
  const user = "new-user"; //leggi il nome utente
  const orario = 17.40;
  /**
   *  Recupero le info del nuovo progetto ed
   *  nvece di fare queste cose sotto
   *  dovremo inviare al server i dati e richiamare
   *  la funzione mainPage() per ricaricare i progetti disponibili.
   */
  
  document.getElementById("projectbody").innerHTML ="";
  mainPage();
  /*
  //Non serve a niente tanto richiamo la funzione mainPage per
  //ricaricare la pagina con i progetti
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
  */
}

//In questa funzione rendo visibile il form per l'inserimento 
// di un nuovo progetto
function createProject() {
  document.querySelector(".new-page").removeAttribute("hidden");
}

function mainPage(){
  document.querySelector(".home-page").removeAttribute("hidden");
  document.querySelector(".data-page").setAttribute("hidden", true);
  document.getElementById("databody").innerHTML="";
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

}


function showLoginPage(){ 
  /**
   * Qualcosa con il server per dire che stai uscendo
   */
  document.getElementById("projectbody").innerHTML="";
  document.getElementById("databody").innerHTML="";

  document.querySelector(".home-page").setAttribute("hidden", true);
  document.querySelector(".data-page").setAttribute("hidden", true);

  document.querySelector(".login-page").removeAttribute("hidden");
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
  /**
   * Listener per i pulsanti della login page
   */
  const loginBtn = document.getElementById("btn-login");
  loginBtn.addEventListener('click', login);//funzione di login

  const signupBtn = document.getElementById("btn-signup");
  signupBtn.addEventListener('click', signup); //funzione di signup

  /**
   * Listener per i pulsanti presenti nella home page
   */
  const updateBtn = document.getElementById("btn-update-project");
  updateBtn.addEventListener('click', showProject); //Funzione per la visualizzazione dei dati di un progetto

  const createBtn = document.getElementById("btn-create-project");
  createBtn.addEventListener('click', createProject); //Funzione per la creazione di un nuovo progetto

  const deleteBtn = document.getElementById("btn-delete-project");
  deleteBtn.addEventListener('click', deleteProject); //Funzione per l'eliminazione di un progetto presente
  

  /**
   * Listener per l'inserimento di un nuovo progetto
   */
  const insertBtn = document.getElementById("btn-insert-project");
  insertBtn.addEventListener('click', insertProject);

  /**
   * Listener per i pulsanti presenti nella schermata
   * di visualizzazione dei dati dei singoli progetti 
   */
   const deleteDataBtn = document.getElementById("btn-delete-data");
   deleteDataBtn.addEventListener('click', deleteData);
 
   const createDataBtn = document.getElementById("btn-create-data");
   createDataBtn.addEventListener('click', createData);


   /**
    * Listener per il form per l'inserimento di nuovi dati
    */
    const insertDataBtn = document.getElementById("btn-insert-data");
    insertDataBtn.addEventListener('click', insertData);

    const backBtn = document.getElementById("btn-back");
    backBtn.addEventListener('click', mainPage);

    /**
     * Listener per il logout
     */
    const logoutBtn = document.getElementsByClassName("btn-logout");
    logoutBtn[0].addEventListener('click', showLoginPage);
    logoutBtn[1].addEventListener('click', showLoginPage);
}

init();