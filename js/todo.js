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

    console.log(allUsers)
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
        newtodo.reminder = "Yes";
        newtodo.rdate = document.getElementById('rdate').value;
    }
    else if(document.getElementById('chkNo').checked){
        newtodo.reminder = 'No';
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
//show table for updae record
function updateTodo(){
    //hide view todo table
    document.getElementById('showdata').style.display = "none"   

    hideAllElements();
    let text = "";
    var users = JSON.parse(localStorage.getItem('users'));
    var todos = users[userIndex].todo;
    text += `<option value="NA">Choose Todo</option>`;

    for(let i = 0; i < todos.length; i++)
    {
        text += `<option value="${i}">${todos[i].tname}</option>`;
    }
    document.getElementById("chooseTodoName").innerHTML = text;
    document.getElementById("chooseTodoName").style.display = "block";

    document.getElementById('updatetodo').style.display = 'block';
    document.getElementById('cat-list').style.display = 'block';
    
}

function fillTodoData(index)
{


    let users = JSON.parse(localStorage.getItem('users'));
    if(index.value != "NA")
    {
        //displaying update form
        document.getElementById('updatetodoRecord').style.display = 'block';

        var todo = users[userIndex].todo[index.value];
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
        
        console.log(todo)

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
    var todoIndex = document.getElementById('chooseTodoName').value;
    var todo = allUsers[userIndex].todo[todoIndex];
    // var updateTodo = {
    //     tname : 
    // }

    todo.tname = document.getElementById('ctnameu').value;
    todo.cdate = document.getElementById('cdateu').value;
    todo.isdone = document.getElementById("dyesu").checked == true ? true : false;
    todo.ispublic = document.getElementById('pyesu').checked == true ? true : false;
    todo.todoimg = document.getElementById('updateimg').src;
    todo.reminder = document.getElementById('chYesu').checked == true ? true : false;
    todo.rdate = document.getElementById("chYesu").checked == true ? document.getElementById('rdateu').value : "NA";
    alert("Profile Updated Successfully....");
    console.log("profile updated")

    localStorage.setItem('users',JSON.stringify(users));
    window.location = "todo.html";
}

//-------------------------------------------------------Delete Todo--------------------------------------------------------------------------------------
//for delete element shows table
function deleteTodo(){
    hideAllElements();
    document.getElementById('deletetodo').style.display= 'block';
    document.getElementById('showdata').style.display = "none"

    let text = "";
    var users = JSON.parse(localStorage.getItem('users'));
    var todos = users[userIndex].todo;
    text += `<option value="NA">Choose Todo</option>`;

    for(let i = 0; i < todos.length; i++)
    {
        text += `<option value="${i}">${todos[i].tname}</option>`;
    }
    document.getElementById("chooseDeleteTodoName").innerHTML = text;
    
}

function deleteSelectedTodo()
{
    var index = document.getElementById('chooseDeleteTodoName').value;
    var todos = allUsers[userIndex].todo;

    var temp = todos[index].tname;
    todos.splice(index, index);
    alert("deleted : "+ temp)

    localStorage.setItem('users', JSON.stringify(users));
    viewTodo();

}


//perform delete operations
function deleteAll(){
         var users = JSON.parse(localStorage.getItem('users'));
        var todos = users[userIndex].todo;
        todos.splice(0, todos.length);
        localStorage.setItem('users', JSON.stringify(users));
        alert("deleted all todos")

        viewTodo();
}


//calling on delete todo(s) button 
function DeleteCheckedTodo()
{
    // var allShownTodo = document.getElementsByName('chkRecord');
    if(todoId.length)
    {
        var todos = allUsers[userIndex].todo;
        for(let i = 0; i < todoId.length; i++)
        {
                todos.splice(todoId[i], 1);
                console.log("check todoID length"+todoId);
        }
        localStorage.setItem('users', JSON.stringify(allUsers));
        viewTodo();
    }
    else{
        alert("Select Todo(s)");
    }
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
                console.log("print :"+todoIsDone[0].tname);
                console.log("print :"+todoIsDone[0].cdate);
            }
        }
        if(todoIsDone.length){
            showTabularData(todoIsDone)
            document.getElementById('commondError').innerText = "";
        }
        else{
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
                console.log(allTodo[j])
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
        showTabularData(todos);
    }
    else
    {
        document.getElementById('cat-list').innerHTML = "From Date should be Greater than to date";
    }
    document.getElementById('datefrom').value = '';
    document.getElementById('dateto').value = '';
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

function checkAllRecords(element)
{
    var allShownTodo = document.getElementsByName('chkRecord');
    if(element.checked)
    {
        todoId.splice(0, todoId.length);
        for(let i = 0; i < allShownTodo.length; i++)
        {
            allShownTodo[i].checked = true;
            todoId.push(allShownTodo[i].id);
        }
        console.log(todoId)
    }
    else
    {
        for(let i = 0; i < allShownTodo.length; i++)
        {
            allShownTodo[i].checked = false;
        }
        todoId.splice(0, todoId.length);
        console.log(todoId)

    }
}

var todoId=[];
function checkedRecord(element)
{
    if(document.getElementById(element.id).checked)
    {
        todoId.push(element.id)

    }
    else{
        todoId.splice(todoId.indexOf(element.id),1);

    }
    console.log(todoId)
    
}

function showTabularData(data, title)
{   title = "have to intialize" 
    // console.log(title)
    document.getElementById('showdata').style.display = "block"
    var text= "";
    text+=`<tr><th><input type="checkbox" id='main' onclick="checkAllRecords(this)"></th>`;
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
            <td><input type="checkbox" id='${i}' name="chkRecord" onclick="checkedRecord(this)"></td>
            <td>${row.tname}</td>
            <td>${row.cdate}</td>
            <td>${row.category}</td>
            <td>${row.ispublic==true? 
                "<i class='fa fa-check-square-o' aria-hidden='true' style='margin-left:20px;'></i>" 
                : "<i class='fa fa-times' aria-hidden='true' style='margin-left:25px;'></i>"}</td>
            <td>${row.isdone==true? 
                "<i class='fa fa-check-square-o' aria-hidden='true' style='margin-left:20px;'></i>" 
                : "<button id="+i+" onclick='changePendingStatus(this)'>Pending</button>"}</td>
            <td>${row.reminder == 'Yes'? 
                "<i class='fa fa-check-square-o' aria-hidden='true' style='margin-left:20px;'></i>" 
                : "<i class='fa fa-times' aria-hidden='true' style='margin-left:25px;'></i>"}</td>
            <td>${row.rdate == 'NA' ? "<i style='margin-left:40px;'>-</i>" : row.rdate }</td>`;

        text+="</tr>"
    }
    document.getElementById('showTabularData').innerHTML = text;
}

function changePendingStatus(element)
{
    var toChangableTodo = allUsers[userIndex].todo;
    console.log(toChangableTodo)
    toChangableTodo[element.id].isdone = true;

    localStorage.setItem('users', JSON.stringify(allUsers));
    location.reload();

}

function hideAllElements(){
    document.getElementById('cat').style.display = 'none';
    document.getElementById('createtodo').style.display = 'none';
    document.getElementById('viewtodo').style.display = 'none';
    document.getElementById('updatetodo').style.display = 'none';
    document.getElementById('deletetodo').style.display = 'none';
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

// //show table data
// function tableShow(i){
//     var text;
//     let catArr = [];
//     text="<td>"+usertodo[i].todoname + "</td>"
//     text+="<td>"+usertodo[i].todoname + "</td>"
//     if(usertodo[i].catStudy != undefined || usertodo.catStudy != ""){
//         catArr.push(usertodo[i].catStudy);
//     }
//     if(usertodo[i].catSport != undefined || usertodo[i].catSport != ""){
//         catArr.push(usertodo[i].catSport);
//     }
//     if(usertodo[i].catOther != undefined || usertodo[i].catOther != ""){
//         catArr.push(usertodo[i].catOther);
//     }
//     text+="<td>"+catArr.toString() + "</td>"
//     text+="<td>"+catArr[i].isdone + "</td>"
//     text+="<td>"+catArr[i].ispublic + "</td>"
//     text+="<td>"+catArr[i].reminder + "</td>"
//     text+="<td>"+catArr[i].rdate + "</td>"
//     text+="<td><img src ='"+catArr[i].todoimg + "' height='100px' width='150px'> </td>"
//     return text;
// }



// //filtering data by category wise
// function byCat()
// {
//     document.getElementById('cat-list').style.display = 'block';
//     let cat = document.getElementById('cat')=value;
//     if(cat == 'select')
//     {
//         viewLoads();
//     }
//     else{
//         var i;
//         var f = false;
//         var text = "<table class='tab'><tr>,th>Task Name</th><th>ToDo Date</th><th>Category</th><th>Mark as Done</th><th>isPublic</th><th>Reminder</th><th>Reminder Date</th><th>Todo Image</th></tr>";

//         for(i = 0; i < usertodo.length; i++)
//         {
//             if(usertodo[i].username == username)
//             {
//                 if(usertodo[i].catStudy == cat || usertodo[i].catSport == cat || usertodo[i].catOther == cat)
//                 {
//                     f = true;
//                     text += "<tr>"+tableShow(i)+"</tr>";
//                 }
//             }
//         }
//         text+="</table>";
//         if(f == true){
//             document.getElementById('cat-list').innerHTML = text
//         }
//         else{
//             document.getElementById('cat-list').innerHTML = "No Data Available";
//         }
//     }
// }









// //soters index of element to be update and display update form
// function updateStoreIndex(index)
// {
//     document.getElementById('updaetodoRecord').style.display='block';
//     document.getElementById('cat-list').style.display = 'none';
//     sessionStorage.setItem('indexUpdate', index)
//     document.getElementById('ctnameu').value = usertodo[index].todoname;
//     document.getElementById('cdateu').value = usertodo[index].cdate;
//     document.getElementById('uimg').src = usertodo[index].todoimg;

//     if(usertodo[index].isdone == 'yes'){
//         document.getElementById('dyesu').checked = true;
//     }
//     else{
//         document.getElementById('dnou').checked = true;
//     }
//     if(usertodo[index].ispublic == 'yes'){
//         document.getElementById('pyesu').checked = true;
//     }
//     else{
//         document.getElementById('pnou').checked = true;
//     }
//     if(usertodo[index].reminder == 'Yes')
//     {
//         document.getElementById('chYesu').checked = true;
//         RDate.style.visibility = 'visible';
//         document.getElementById('rdateu').value = usertodo[index].rdate;
//     }
//     else
//     {
//         RDate.style.visibility = 'hidden';
//         document.getElementById('chNou').checked = true;
//     }
// }

// // showing or hiding reminder date for updateTodo
// function ShowHideRDiv(){
//     var chYes = document.getElementById('chYesu');
//     var RDate = document.getElementById('RDate');
//     RDate.style.visibility = chYes.checked? "visible" : "hidden";
// }

// //update todo operation perform
// function updateRecord(){
//     let index = sessionStorage.getItem('indexUpdate');
//     let cdate, catSports, catStudy, catOther, done, reminder, rdate, ispublic, tid, tname;
//     var x = true;
//     tname = document.getElementById('ctnameu').value;
//     tname = tname.trim();
//     if(tname == "" || tname == null)
//     {
//         document.getElementById('ctname_uErr').innerHTML = "Name is mandatory";
//         x = false;
//     }
//     else{
//         document.getElementById('ctname_uErr').innerHTML = "";
//     }
//     if(document.getElementById('cdateu').value == "")
//     {
//         document.getElementById('cdate_uErr').innerHTML = "Date is mandatory";
//         x = false;
//     }
//     else
//     {
//         cdate = document.getElementById('cdateu').value;
//         document.getElementById('cdate_uErr').innerHTML = "";
//     }
//     if(document.getElementById('dyesu').checked){
//         done = document.getElementById('dyesu').value;
//     }
//     else if(document.getElementById('dyesu').checked){
//         done = document.getElementById('dnou').value;
//     }
//     else{
//         document.getElementById('done_uErr').innerHTML = "Choose one option";
//     }
//     if(document.getElementById('pyesu').checked){
//         ispublic = document.getElementById('pyesu').value;
//         document.getElementById('public_uErr').innerHTML = "";
//     }
//     else if(document.getElementById('pnou').checked){
//         ispublic = document.getElementById('pnou').value;
//         document.getElementById('public_uErr').innerHTML = "";
//     }
//     else{
//         document.getElementById('public_uErr').innerHTML = "choose one option";
//     }

//     if(document.getElementById('chYesu').checked){
//         reminder = yes;
//         rdate = document.getElementById('rdateu').value;
//     }
//     else if(document.getElementById('chNou').checked){
//         reminder = 'No';
//         rdate = null;
//     }
//     if(document.getElementById('chYesu').checked == false && document.getElementById('chNou').checked == false){
//         document.getElementById('rem_uErr').innerHTML = "Choose one option";
//     }
//     if(document.getElementById('chYesu').checked == true && document.getElementById('rdateu').value == ""){
//         document.getElementById('rdate_uErr').innerHTML = "Choose reminder date";
//     }

//     if(document.getElementById('uimg').src == "" && document.getElementById('toimg').isDefaultNamespace.length == 0){
//         document.getElementById('img_uErr').innerHTML = "Image is mandatory";
//     }
//     else if(document.getElementById('uimg').src!=""){
//         todoimg = usertodo[index].todoimg;
//     }
//     else if(document.getElementById('toimg').isDefaultNamespace.length == 1){
//         todoimg = res;
//     }

//     catStudy = usertodo[index].catStudy;
//     catSports = usertodo[index].catSports;
//     catOther = usertodo[index].catOther;
//     tid = usertodo[index].tid;
//     if(x != true){
//         return false;
//     }
//     else{
//         usertodo[index].tid = tid;
//         usertodo[index].todoname = tname;
//         usertodo[index].cdate = cdate;
//         usertodo[index].catStudy = catStudy;
//         usertodo[index].catSports = catSports;
//         usertodo[index].catOther = catOther;
//         usertodo[index].isdone = done;
//         usertodo[index].reminder = reminder;
//         usertodo[index].rdate = rdate;
//         usertodo[index].ispublic = ispublic;
//         usertodo[index].todoimg  = todoimg;
//         localStorage.setItem('user-todo', JSON.stringify(usertodo));
//         location.reload();    
//     }
// }



// // image to base 64
// //---------------------------- ///  Use another functionn---------------------------
// function encodeImageFileAsURL(element)
// {
//     let file = element.files[0];
//     let reader = new FileReader();
//     reader.onloadend = function(){
//         res = reader.result;
//         localStorage.setItem('imgbase64', res);
//         reader,this.readAsDataURL(file);
//     }
// }



// //sorting by table index nubmer

// function sortTable(n){
//     var table;
//     console.log(n);
//     console.log(document.getElementById("table5"));
//     table = document.getElementById('table5');
//     var raows, i, x, y, count = 0;
//     var switching = true;

//     // order is set as ascending
//     var direction = "ascending";
    
//     //run loop until no switching is needed
//     while(switching)
//     {
//         switching = false;
//         var rorws = table.rows;

//         //loop to go through all rows
//         for(i = 1; i < (rows.length - 1); i++)
//         {
//             var Switch = false;

//             x = rows[i].getElementsByTagName('td')[n];
//             y = rows[i].getElementsByTagName('td')[n];

//             if(direction == "ascending"){
//                 if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()){
//                     Switch = true;
//                     break;
//                 }
//             }
//             else if(direct == 'descending'){
//                 if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()){
//                     Switch = true;
//                     break;
//                 }
//             }
//         }
//         if(Switch){
//             rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//             switching = true;
//             count++;
//         }
//         else{
//             if(count == 0 && direction == 'ascending'){
//                 direction = 'descending';
//                 switching = true;
//             }
//         }
//     }
// }

// //show sort in table
// function sortTableShow()
// {
//     hideAllElements();
//     document.getElementById('cat-list').style.display = 'block';
//     var i;
//     var f = false;
//     var text = "<table class='tab' id='table5'>";
//     text +="<tr><th onclick='sortTable(0)'>Task Name<img src='Images/arrow.png' class='sort-arrow'></img></th>";
//     text +="<th onclick='sortTable(1)'>Todo date<img src='Images/arrow.png' class='sort-arrow'></img></th>";
//     text +="<th onclick='sortTable(2)'>Category<img src='Images/arrow.png' class='sort-arrow'></img></th>";
//     text +="<th onclick='sortTable(3)'>Marks as done<img src='Images/arrow.png' class='sort-arrow'></img></th>"
//     text +="<th onclick='sortTable(4)'>isPublic <img src='Images/arrow.png' class='sort-arrow'></img></th>"
//     text +="<th onclick='sortTable(5)'>Reminder<img src='Images/arrow.png' class='sort-arrow'></img></th>"
//     text +="<th onclick='sortTable(6)'>Reminder date<img src='Images/arrow.png' class='sort-arrow'></img></th>"
//     text +="<th>Todo Image<img src='Images/arrow.png' class='sort-arrow'></img></th></tr>";

//     for(i = 0; i < usertodo.length; i++)
//     {
//         f = true;
//         text+="<tr>"+ tableShow(i)+"</tr>";
//     }
//     text+="</table>";
//     if(f == true){
//         document.getElementById('cat-list').innerHTML = text;
//     }
//     else{
//         document.getElementById('cat-list').innerHTML = "No data Available"
//     }
// }