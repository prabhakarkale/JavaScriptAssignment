var username;
var userIndex;
var allUsers;

(function(){
    if(sessionStorage.getItem('activeUser') == undefined || sessionStorage.getItem('activeUser') == "")
    {
        window.location = "login.html";
    }
    else{
        username = (sessionStorage.getItem("activeUser")).substring(1, sessionStorage.getItem('activeUser').length-1)
        allUsers = JSON.parse(localStorage.getItem('users'));
        for(let i = 0; i < allUsers.length; i++){
            if(allUsers[i].email == username){
                userIndex = i;
                break;
            }
        }
    }

    // console.log(allUsers)
})();

let res;
let arr=[];

// ------------------------------------------------------------Add Todo Section ----------------------------------------------------------------------------------

// shows create todo form
function createTodo(){
    hideAllElements();
    document.getElementById('createtodo').style.display="block";
}

//showinng or hiding date on create Todo
function showOrHideDiv(){
    var chkYes = document.getElementById('chkYes');
    var remDate = document.getElementById('RemDate')
    remDate.style.visibility = chkYes.checked ? "visible" : "hidden";
}

// create todo method
function addTodo()
{
    document.getElementById('cat-list').style.display = 'none';
    let cdate, tname;
    var x = true;
    
    cdate = document.getElementById('cdate').value;
    tname = (document.getElementById('todoName').value).trim();
    

    let newtodo = {
        tname : tname,
        cdate : cdate,
        catStudy : checkCategoryChecked('study'),
        catSports : checkCategoryChecked('sports'),
        catOther : checkCategoryChecked('other'),
        isdone : false,
        reminder : "",
        rdate : "",
        ispublic : checkIsPublic(),
        todoimg : document.getElementById('addimg').src
    };


    if(checkAddTodoValidation(newtodo))
    {
        let users = JSON.parse(localStorage.getItem('users'));
        for(let i = 0; i < users.length; i++)
        {
            if(users[i].email == username)
            {
                users[i].todo.push(checkAddTodoValidation(newtodo))
            localStorage.setItem('users',JSON.stringify(users));
            console.log("TODO : "+newtodo.tname+" added");
            alert("added TODO : " + newtodo.tname);
            window.location = "todo.html"
            viewTodo();
            }
        }
        
    }
}


function checkAddTodoValidation(newtodo){
    var Todate = new Date();

    var x = true;
    
    if(newtodo.tname == "" || newtodo.tname ==null || newtodo.tname == undefined){
        document.getElementById('todo-nameErr').innerHTML = "Todo Name is mandatory";
        x = false;
    }
    else{
        document.getElementById('todo-nameErr').innerHTML = "";
    }

    if(new Date(newtodo.cdate).getTime() <= Todate.getTime()){
        document.getElementById('cdateErr').innerHTML = "*Invalid date";
        x = false;
    }
    else if(newtodo.cdate == null || newtodo.cdate == ""){
        document.getElementById('cdateErr').innerHTML = "date is mandatory";
        x = false;
    }
    else{
        document.getElementById('cdateErr').innerHTML = "";
    }

    //reminder section
    if(document.getElementById('chkYes').checked){
        newtodo.reminder = true;
        newtodo.rdate = document.getElementById('rdate').value;
    }
    else if(document.getElementById('chkNo').checked){
        newtodo.reminder = false;
        newtodo.rdate = 'NA';
    }

    

    if( document.getElementById('chkYes').checked == true && document.getElementById('rdate').value == ""){
        document.getElementById('rdateErr').innerHTML = "Reminder date is Mandatory";
        x = false;
    }
    
    else if((document.getElementById('chkYes').checked == true) && ((new Date(newtodo.rdate).getTime() > new Date(newtodo.cdate).getTime()))){
        document.getElementById('rdateErr').innerHTML = "*invalid date";
        x = false;
    }
    else if(new Date(newtodo.rdate).getDay() < Todate.getDay())
    {
        document.getElementById('rdateErr').innerHTML = "*invalid date";
        x = false;
    }
    else{
        document.getElementById('rdateErr').innerHTML = "";
    }


    if(newtodo.catStudy == false && newtodo.catSports == false && newtodo.catOther == false){
    
        document.getElementById('catErr').innerHTML = "*Select Categories...";
        x = false;
    }
    else{
            document.getElementById('catErr').innerHTML = "";
    }

    if(document.getElementById('addimg').files.length == 0){
        document.getElementById('imgErr').innerHTML = "attachment is mandatory";
        x = false;
    }
    else{
        document.getElementById('imgErr').innerHTML = "";
    }

    if(x!=true){
        return false;
    }
    else{
        return newtodo;
    }
}

function checkCategoryChecked(cat)
{
    if(document.getElementById(cat).checked == true){
        return true;
    }
    else{
        return false;
    }
}

function checkIsPublic()
{
    if(document.getElementById('pyes').checked == true){
        return true;
    }
    else
    {
        return false;
    }
}

function getAddTodoImage() {
    var input = document.getElementById("addimg");
    var imagereader = new FileReader();
    imagereader.readAsDataURL(input.files[0]);
    imagereader.onloadend = function(event) {
        var profileImage = document.getElementById("addimg");
        profileImage.src = event.target.result;
        document.getElementById('previewimage').src = event.target.result;
    }
}

// ------------------------------------------------View Todo section--------------------------------------------------------------------------------------------
//shows view todo Table
function viewTodo(){
    hideAllElements();
    document.getElementById('viewtodo').style.display = 'blcok';
    viewLoads();
}

// show list of todo records (by default on page load)
function viewLoads(){
    document.getElementById('showdata').style.display = "block"
    var data = [];
    var users = JSON.parse(localStorage.getItem('users'));
    var usertodo;
        for(let i = 0; i < users[userIndex].todo.length; i++)
        {
               usertodo = users[userIndex].todo[i];  
               
                var x = getTodoObject(usertodo)
                data.push(x);
        }
        showTabularData(data);
}

// ---------------------------------------------------------- Update Todo --------------------------------------------------------
function updateSpecificTodo(element)
{
     hideAllElements();
     document.getElementById('updatetodo').style.display = 'block';
     let users = JSON.parse(localStorage.getItem('users'));
     var index = element.id;
    if(index != "")
    {
        //displaying update form
        document.getElementById('updatetodoRecord').style.display = 'block';

        var todo = allUsers[userIndex].todo[index];
        document.getElementById('todo_id').value = index;
        document.getElementById('ctnameu').value = todo.tname;
        document.getElementById('cdateu').value = todo.cdate;
        if(todo.isdone)
        {
            document.getElementById('dyesu').checked = true;
        }
        else
        {
            document.getElementById('dnou').checked = true;
        }

        if(todo.ispublic)
        {
            document.getElementById('pyesu').checked = true;
        }
        else
        {
            document.getElementById('pnou').checked = true;
        }
        document.getElementById("updatepreviewimage").src=todo.todoimg;
        document.getElementById('updateimg').src = todo.todoimg;
        if(todo.reminder == true)
        {
            document.getElementById('chYesu').checked = true;
            document.getElementById('rdateu').value = todo.rdate;
            showOrHideDate();
        }
        else
        {
            document.getElementById('chNou').checked = true;
            showOrHideDate();
        }

        document.getElementById('ctnameu').value = todo.tname;
        document.getElementById('ctnameu').value = todo.tname;
        document.getElementById('ctnameu').value = todo.tname;
        document.getElementById('ctnameu').value = todo.tname;
    
    }
    else{
        document.getElementById('updatetodoRecord').style.display = 'none';
    }
}

function showOrHideDate(){
    var chkYes = document.getElementById('chYesu');
    var remDate = document.getElementById('RDate')
    remDate.style.visibility = chkYes.checked ? "visible" : "hidden";
}

function updateTodoData()
{
    var todoIndex = document.getElementById('todo_id').value;
    var todo = allUsers[userIndex].todo[todoIndex];
    var updateTodo = {
        tname : document.getElementById("ctnameu").value,
        cdate : document.getElementById('cdateu').value,
        isdone : document.getElementById("dyesu").checked == true ? true : false,
        ispublic : document.getElementById('pyesu').checked == true ? true : false,
        todoimg : document.getElementById('updateimg').src,
        reminder : document.getElementById('chYesu').checked == true ? true : false,
        rdate : document.getElementById("chYesu").checked == true ? document.getElementById('rdateu').value : "NA"
    };

    if(isUpdateTodoValid(updateTodo))
    {
        todo.tname = updateTodo.tname;
        todo.cdate = updateTodo.cdate;
        todo.isdone = updateTodo.isdone;
        todo.ispublic = updateTodo.ispublic;
        todo.todoimg = updateTodo.todoimg;
        todo.reminder = updateTodo.reminder;
        todo.rdate = updateTodo.rdate;
        localStorage.setItem('users',JSON.stringify(allUsers));
        alert("Profile Updated Successfully....");
        window.location = "todo.html";
    }
}

function isUpdateTodoValid(demoTodo)
{
    var Todate = new Date();

    var x = true;
    
    //todo name
    if(demoTodo.tname == "" || demoTodo.tname ==null || demoTodo.tname == undefined){
        document.getElementById('ctname_uErr').innerHTML = "Todo Name is mandatory";
        x = false;
    }
    else{
        document.getElementById('ctname_uErr').innerHTML = "";
    }

    //cdate 
    if(new Date(demoTodo.cdate).getTime() <= Todate.getTime()){
        document.getElementById('cdate_uErr').innerHTML = "*Invalid date";
        x = false;
    }
    else if(demoTodo.cdate == null || demoTodo.cdate == ""){
        document.getElementById('cdate_uErr').innerHTML = "date is mandatory";
        x = false;
    }
    else{
        document.getElementById('cdate_uErr').innerHTML = "";
    }

    //reminder section
    if(document.getElementById('chYesu').checked){
        demoTodo.reminder = true;
        demoTodo.rdate = document.getElementById('rdateu').value;
    }
    else if(document.getElementById('chNou').checked == false){
        demoTodo.reminder = false;
        demoTodo.rdate = 'NA';
    }

    

    if( document.getElementById('chYesu').checked == true && document.getElementById('rdateu').value == ""){
        document.getElementById('rdateErr').innerHTML = "Reminder date is Mandatory";
        x = false;
    }
    
    else if((document.getElementById('chYesu').checked == true) && ((new Date(demoTodo.rdate).getTime() > new Date(demoTodo.cdate).getTime()))){
        document.getElementById('rdate_uErr').innerHTML = "*invalid date";
        x = false;
    }
    else if(new Date(demoTodo.rdate).getDay() < Todate.getDay())
    {
        document.getElementById('rdate_uErr').innerHTML = "*invalid date";
        x = false;
    }
    else{
        document.getElementById('rdate_uErr').innerHTML = "";
    }


    // if(demoTodo.catStudy == false && demoTodo.catSports == false && demoTodo.catOther == false){
    
    //     document.getElementById('catErr').innerHTML = "*Select Categories...";
    //     x = false;
    // }
    // else{
    //         document.getElementById('catErr').innerHTML = "";
    // }

    if(demoTodo.todoimg == ""){
        document.getElementById('imgErr_uErr').innerHTML = "attachment is mandatory";
        x = false;
    }
    else{
        document.getElementById('imgErr_uErr').innerHTML = "";
    }

    if(x!=true){
        return false;
    }
    else{
        return true;
    }
}

//-------------------------------------------------------Delete Todo--------------------------------------------------------------------------------------

//perform delete operations
function deleteAll(){
         var users = JSON.parse(localStorage.getItem('users'));
        var todos = users[userIndex].todo;
        if(todos.length >= 1){
            todos.splice(0, todos.length);
            localStorage.setItem('users', JSON.stringify(users));
            alert("deleted all todos")
            viewTodo();
        }
        else
        {
            alert("No Todo(s) Available...")
        }
}

function deleteSpecificTodo(element)
{
    var index = element.id;
    var todos = allUsers[userIndex].todo;

    todos.splice(index, 1);

    localStorage.setItem('users', JSON.stringify(allUsers));
    viewTodo();

}

//-------------------------------------------------
//shows input types for filter
function byfilter(element){
    if(element.value == 'isDone')
    {
        hideAllElements();

        var users = JSON.parse(localStorage.getItem('users'));
        document.getElementById('showdata').style.display = 'block';
        var todoIsDone = [];
        for(let j = 0; j < users[userIndex].todo.length; j++)
        {
            if(users[userIndex].todo[j].isdone == true)
            {
                var todo = getTodoObject(users[userIndex].todo[j])
                todoIsDone.push(todo);
            }
        }
        if(todoIsDone.length){
            showTabularData(todoIsDone)
            document.getElementById('commondError').innerText = "";
        }
        else{
            document.getElementById('showdata').style.display = "none"
            document.getElementById('commondError').innerHTML = "No Data Found..."
        }
    }
    else if(element.value == 'categories'){
        hideAllElements();
        document.getElementById('showCategory').style.display = "block"
        document.getElementById('filter-box').value = 'select';
    }
    else if(element.value == 'dateRange')
    {
        hideAllElements();
        document.getElementById('dateRangeDiv').style.display = 'block';
        document.getElementById('filter-box').value = 'select';
    }
    else if(element.value == 'isPending')
    {

        hideAllElements();
        var users = JSON.parse(localStorage.getItem('users'));
        document.getElementById('showdata').style.display = 'block';
        var todoIsPending = [];
        for(let j = 0; j < users[userIndex].todo.length; j++)
        {
            if(users[userIndex].todo[j].isdone == false)
            {
                var todo = getTodoObject(users[userIndex].todo[j])
                todoIsPending.push(todo);            }
        }
        // todoIsPending.length > -1 ? document.getElementById('showdataError').innerHTML = "" : document.getElementById('showdataError').innerHTML = "No Data Available";
        showTabularData(todoIsPending)
        document.getElementById('filter-box').value = "select";
    }
}

function loadCatWiseData()
{
    var users = JSON.parse(localStorage.getItem('users'));
    var allTodo = users[userIndex].todo;

    let study = document.getElementById('chkShowCatStudy').checked;
    let sports = document.getElementById('chkShowCatSports').checked;
    let other = document.getElementById('chkShowCatOther').checked;
    if(study || sports || other )
    {
        hideAllElements();
        document.getElementById('showCategory').style.display = "block";
        document.getElementById('showdata').style.display = 'block';
        var todos = [];
        for(let j = 0; j < allTodo.length; j++)
        {
            
            if(allTodo[j].catStudy == study && allTodo[j].catSports == sports && allTodo[j].catOther == other)
            {
                var todo = getTodoObject(allTodo[j])
                todos.push(todo);
            }
        }
        showTabularData(todos)
    }
}

//filter according to data range
function datetofrom(){
    var users = JSON.parse(localStorage.getItem('users'))
    var tdate = document.getElementById('dateto').value;
    var fdate = document.getElementById('datefrom').value;
    if(tdate>fdate)
    {
        var todos = [];
        for(let j = 0; j < users[userIndex].todo.length; j++)
        {
            var temptodo = users[userIndex].todo[j];
            if(temptodo.cdate > fdate && temptodo.cdate < tdate)
            {
                var todo = getTodoObject(users[userIndex].todo[j])
                todos.push(todo);
            }
        }
        document.getElementById("dateRange_Error").style.display = "none";

        showTabularData(todos);
    }
    else
    {
        document.getElementById("showdata").style.display = "none";
        document.getElementById("dateRange_Error").style.display = "block";
        document.getElementById('dateRange_Error').innerHTML = "From Date should be Greater than to date";
    }
}

//--------------------------------------------------- Search By Data -------------------------------------------------------------------------------------------
// search utility function
function bysearch(element){
    hideAllElements();
    document.getElementById('searchtodo').style.display = 'block';
    if(element.value == 'tdate'){
        document.getElementById('bytdate').style.display = 'block';
        document.getElementById('bytname').style.display = 'none';
        document.getElementById('search-box').value = 'select';
    }
    else if(element.value == "search-tname"){
        document.getElementById('bytdate').style.display = 'none';
        document.getElementById('bytname').style.display = 'block';
        document.getElementById('search-box').value = 'select';
    }
}

//search by task name
function searchName(){

    let users = JSON.parse(localStorage.getItem('users'));
    let usertodo = users[userIndex].todo;
    var tname = document.getElementById('myInput').value;
    var f = false;
    let result = [];
        for(let i = 0; i < usertodo.length; i++)
        {
                if(usertodo[i].tname == tname)
                {
                    f = true;
                    result.push(getTodoObject(usertodo[i])); 
                }
        }
        if(f == true)
        {
            showTabularData(result)
            document.getElementById('nameSearchError').innerHTML = "";
        }
        else
        {
            document.getElementById('nameSearchError').style.display = "block";
            document.getElementById('nameSearchError').innerHTML = "No Data Found...";
            document.getElementById('showdata').style.display = "none"
        }

    // var input,filter,table,tr,td,i,txtValue;
    // input = document.getElementById('myInput');
    // filter = input.value.toUpperCase();
    // table = document.getElementById('tab1');
    // tr = table.getElementsByTagName('tr');
    // for(i =0; i < tr.length; i++)
    // {
    //     td = tr[i].getElementsByTagName('td')[0];
    //     if(td){
    //         txtValue = td.textContent || td.innerText;
    //         if(txtValue.toUpperCase().indexOf(filter) > -1){
    //             tr[i].style.display = "";
    //         }
    //         else{
    //             tr[i].style.display = 'none';
    //         }
    //     }
    // }
}

//search by task date
function dateSearch(){
    let users = JSON.parse(localStorage.getItem('users'));
    let usertodo = users[userIndex].todo;
    var fdate = document.getElementById('datesearch').value;
    var f = false;
    let result = [];
        for(let i = 0; i < usertodo.length; i++)
        {
                if(usertodo[i].cdate == fdate)
                {
                    f = true;
                    result.push(getTodoObject(usertodo[i])); 
                }
        }
        if(f == true)
        {
            showTabularData(result)
            document.getElementById('dateSearchError').innerHTML = "";
        }
        else
        {
            document.getElementById('dateSearchError').style.display = "block";
            document.getElementById('dateSearchError').innerHTML = "No Data Found...";
            document.getElementById('showdata').style.display = "none"
        }
}


//-------------------------------------------------Common Section--------------------------------------------------------------------------------------------------------
//hide all elements

//function getTodoObject(tname, cdate, category, isdone, reminder, rdate, ispublic, todoimg)
function getTodoObject(data)
{
    var Categories = (data.catStudy == true? " Study, " : "")+(data.catSports == true? " Sports, " : "") + (data.catOther == true? "Other" : "");

    let todomodal = {
        tname : data.tname,
        cdate : data.cdate,
        category: Categories,
        isdone : data.isdone,
        reminder : data.reminder,
        rdate : data.rdate,
        ispublic : data.ispublic,
        todoimg : data.todoimg
    };
    return todomodal;
}


function showTabularData(data, title)
{   title = "have to intialize" 
    // console.log(title)
    document.getElementById('showdata').style.display = "block"
    var text= "";
    text+=`<tr>`;
        text+=`<th>Todo Name</th>`;
        text+=`<th>Todo Date</th>`;
        text+=`<th>Category</th>`;
        text+=`<th>Is Public</th>`;
        text+=`<th>Is Done</th>`;
        text+=`<th>Reminder</th>`;
        text+=`<th>Reminder Date</th></tr>`;

    
    for(let i = 0; i < data.length; i++)
    {
        var row = data[i];
        text+=`<tr>
            <td>${row.tname}</td>
            <td>${row.cdate}</td>
            <td>${row.category}</td>
            <td>${row.ispublic==true? 
                "<i class='fa fa-check-square-o' aria-hidden='true' style='margin-left:20px;'></i>" 
                : "<i class='fa fa-times' aria-hidden='true' style='margin-left:25px;'></i>"}</td>
            <td>${row.isdone==true? 
                "<i class='fa fa-check-square-o' aria-hidden='true' style='margin-left:20px;'></i>" 
                : "<button id="+i+" onclick='changePendingStatus(this)'>Pending</button>"}</td>
            <td>${row.reminder == true? 
                "<i class='fa fa-check-square-o' aria-hidden='true' style='margin-left:20px;'></i>" 
                : "<i class='fa fa-times' aria-hidden='true' style='margin-left:25px;'></i>"}</td>
            <td>${row.rdate == 'NA' ? "<i style='margin-left:40px;'>-</i>" : row.rdate }</td>
            <td><button id='${i}' onclick="deleteSpecificTodo(this)" class="redButton">Delete</button>
            <td><button id='${i}' onclick="updateSpecificTodo(this)" class="greenButton">Update</button>`;

        text+="</tr>"
    }
    document.getElementById('showTabularData').innerHTML = text;
}

function changePendingStatus(element)
{
    var toChangableTodo = allUsers[userIndex].todo;
    toChangableTodo[element.id].isdone = true;

    localStorage.setItem('users', JSON.stringify(allUsers));
    location.reload();

}

function hideAllElements(){
    document.getElementById('cat').style.display = 'none';
    document.getElementById('createtodo').style.display = 'none';
    document.getElementById('viewtodo').style.display = 'none';
    document.getElementById('updatetodo').style.display = 'none';
    document.getElementById('searchtodo').style.display = 'none';
    document.getElementById('cat-list').style.display = 'none';
    document.getElementById('showdata').style.display = "none";
    document.getElementById('dateRangeDiv').style.display = "none";
    document.getElementById('showCategory').style.display = "none"
}

function getImage() {
    var input = document.getElementById("updateimg");
    var imagereader = new FileReader();
    imagereader.readAsDataURL(input.files[0]);
    imagereader.onloadend = function(event) {
        var profileImage = document.getElementById("updateimg");
        profileImage.src = event.target.result;
        document.getElementById('updatepreviewimage').src = event.target.result;
    }
}

function logout(){
    sessionStorage.removeItem('activeUser');
}