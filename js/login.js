(function(){
    if(sessionStorage.getItem("activeUser"))
    {
        window.location ="profile.html";
    }
})();


function checkLogin()
{
   
    var uname = document.getElementById('uname').value;
    var passwd = document.getElementById('pwd').value;

    var user = {
        username : uname,
        password : passwd
    };

    if(checkAuthentication(user))
    {

        sessionStorage.setItem('activeUser', JSON.stringify(getActiveUser(user)));
        window.location = "profile.html";
    }
}

function checkAuthentication(user)
{
    var users = JSON.parse(localStorage.getItem("users"))
    var isUserAvailable = false;

    if(user.username == "" && user.password == "")
    {
        document.getElementById('showError').innerHTML = "Enter Valid Username and Password";
        return false;
    }
    if(user.username == "" && user.password != "")
    {
        document.getElementById('showError').innerHTML = "Enter Valid Username";
        return false;
    }
    if(user.username != "" && user.password == "")
    {
        document.getElementById('showError').innerHTML = "Enter Valid Password";
        return false;
    }
    else if(users == null){
        document.getElementById('showError').innerHTML = "No Any User Found";
        return false;
    }
    else{
        console.log(user)

        for(var i = 0; i < users.length; i++)
        {
            if(users[i].email == user.username && users[i].password == user.password)
            {
                isUserAvailable = true;
                break;
            }
        }
        if(!isUserAvailable){
            document.getElementById('showError').innerHTML = "Invalid Login Credenetials...";
            return false;
        }
        return isUserAvailable;
    }


    
}

function getActiveUser(user)
{
    var uname;
    var users = JSON.parse(localStorage.getItem('users'));
    for( var i = 0; i < users.length; i++)
    {
        if(users[i].email === user.username && users[i].password === user.password)
        {
            uname = users[i].email;
            break;
        }
    }
    return uname;
}

function clearMsg(){
    document.getElementById('showError').innerText = "";
}