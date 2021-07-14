

let activeUser = sessionStorage.getItem('activeUser');
let usertodo = JSON.parse(localStorage.getItem('user-todo'));
let user = JSON.parse(localStorage.getItem('users'));
let count = 0;

function test()
{
    console.log(activeUser);
}

(function(){
    if(sessionStorage.getItem('activeUser') == undefined)
    {
        window.location = "login.html";
    }
})();

function loads()
{
    var ttask = "";
    var rtask = "";
    let userObj = {};
    let flag = false;
    var i;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    if(dd<10) { dd = '0'+dd;}
    if(mm < 10) { mm = '0' + mm;}
    today = yyyy + '-'+ mm + "-" + dd;

    for(i =0; i < user.length; i++)
    {
        // alert(user[i].profileimg);

        if(user[i].email == activeUser.substring(1, activeUser.length-1))
        {
            // alert("came is loads")

            document.getElementById("Details").style.display = "block";
            document.getElementById("pimg").src = user[i].profileimg;
            document.getElementById("fn").textContent = user[i].fname;
            document.getElementById("ln").textContent = user[i].lname;
            document.getElementById("un").textContent = user[i].email;
            document.getElementById("gen").textContent = user[i].gender;
            document.getElementById("add").textContent = user[i].address;
            break;
        }
    }

    if(localStorage.getItem('user-todo') != null)
    {
        //remained code
    }

}

function logout()
{
    sessionStorage.removeItem("activeUser");
}

function showNotification(){
    if(count>0)
    {
        document.getElementById("nitification").style.display = block;
    }
}