let res;
let username = sessionStorage.getItem("activeUser");
let user = JSON.parse(localStorage.getItem("users"));

(function(){
    if(username == undefined || username == "" || username == null)
    {
        window.location = "login.html";
    }   
    else
    {
        console.log("session working");
    } 
    
})();

function loadData()
{
    var i;
    for(i = 0; i < user.length; i++)
    {
        if(user[i].email == username.substring(1, username.length-1))
        {

            document.getElementById("fname").value=user[i].fname;
            document.getElementById("lname").value = user[i].lname;
            document.getElementById('address').value = user[i].address;

            if(user[i].gender == 'male')
            {
                document.getElementById('male').checked = true;
            }
            else if(user[i].gender == 'female')
            {
                document.getElementById('female').checked = true;
            }
            else{
                document.getElementById('other').checked = true;
            }
            document.getElementById('pic').src = user[i].profileimg;
            document.getElementById("pimg").src = user[i].profileimg;
        }
    }
}

//edit profile section
function editProfile(){
    let firstn, lastn, address, pimg;
    
    firstn = (document.getElementById('fname').value).trim();
    lastn = (document.getElementById('lname').value).trim();
    address = (document.getElementById('address').value).trim();
    pimg = document.getElementById("pimg").src;
    var userInfo = {
        fname : firstn,
        lname : lastn,
        gender : getSelectedGender(),
        address : address,
        profileimg : pimg
    };

    if(checkValidation(userInfo))
    {
        for(let i = 0; i < user.length; i++)
        {
            if(user[i].email == username.substring(1, username.length-1))
            {
                user[i].fname = firstn;
                user[i].lname = lastn;
                user[i].gender = getSelectedGender();
                user[i].address = address;
                user[i].profileimg = document.getElementById("pimg").src;
                alert("Profile Updated Successfully....");
                break;
            }
        }
        localStorage.setItem('users',JSON.stringify(user));
        window.location = "profile.html";
    }
    else
    {
        return false;
    }
}

function checkValidation(user)
{
    var flag = true;
    //first name validation
    if(user.fname == "" || user.fname == null || user.fname == undefined){
        document.getElementById('fnameError').innerHTML = "First name is mandatory";
        flag = false;
    }
    else if(!isNaN(user.fname)){
        document.getElementById('fnameError').innerHTML = "#Enter alphabet only";
        flag =  false;
    }
    else
    {
        document.getElementById('fnameError').innerHTML = "";
    }

    //last name validation
    if(user.lname == null || user.lname == "" || user.lname == undefined)
    {
        document.getElementById('lnameError').innerHTML = "*Last Name is Mandatory...";
        flag = false;
    }
    else if(!isNaN(user.lname)){
        document.getElementById('lnameError').innerHTML = "*Enter aplhabets only...";
        flag = false;
    }
    else { document.getElementById('lnameError').innerHTML="";}

    //gender validation
    if (user.gender == undefined || user.gender == "" || user.gender == null) {
        document.getElementById("genderError").innerHTML = "*Select Gender...";
        flat = false;
    }

    //address validation
    if(user.address == null || user.address == "")
    {
        document.getElementById('addressError').innerHTML = "*address is Mandatory...";
        flag = false;
    }
    else { document.getElementById('addressError').innerHTML="";}

    //Profile Image validation
    if(user.profileimg == null || user.profileimg == "")
    {
        document.getElementById('imgError').innerHTML = "*Profile Image is Mandatory...";
        flag = false;
    }
    else { document.getElementById('imgError').innerHTML="";}

    if(flag == true)
    {
        return true
    }
    else
    {
        return false;
    }
}


//pickup image from storage and set to the pimg src
function getImage() {
    var input = document.getElementById("pimg");
    var imagereader = new FileReader();
    imagereader.readAsDataURL(input.files[0]);
    imagereader.onloadend = function(event) {
        var profileImage = document.getElementById("pimg");
        profileImage.src = event.target.result;
    document.getElementById('pic').src = event.target.result;
    }
}



//get selected gender
function getSelectedGender()
{
    if(document.getElementById('male').checked == true){
        return 'male';
    }
    else if(document.getElementById('female').checked == true){
        return 'female';
    }
    else if(document.getElementById('other').checked == true){
        return 'other';
    }
    return null;
}

function logout()
{
    sessionStorage.removeItem("activeUser");
}

function hideError(divid) {
    document.getElementById(divid).innerHTML = "";
}

function clearMessage(element)
{
    if(element.id == "fname"){
        document.getElementById('fnameError').innerHTML = "";
    }

    if(element.id == "lname"){
        document.getElementById('lnameError').innerHTML = "";
    }

    if(element.id == "address"){
        document.getElementById('addressError').innerHTML = "";
    }
}