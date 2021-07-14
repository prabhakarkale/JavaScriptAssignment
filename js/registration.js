(function(){
    if(sessionStorage.getItem("activeUser"))
    {
        window.location ="profile.html";
    }
})();



let res;


//Registration
function doRegistration()
{
    let email, gender, fname, lname, address, password, cpassword, pimg;
    var x=true;
    var passwd=/^[A-Za-z]\w{7,14}$/;
    
    email = (document.getElementById('email').value).trim();
    fname = (document.getElementById('fname').value).trim();
    lname = (document.getElementById('lname').value).trim();
    gender = checkGenderValidation();
    address = (document.getElementById('address').value).trim();
    password = (document.getElementById('password').value).trim();
    cpassword = (document.getElementById('confirmPassword').value).trim();
    pimg = document.getElementById("pimg").src;
    
    
    var newUser = {
        fname : fname,
        lname : lname,
        email : email,
        gender : gender,
        address : address,
        password : password,
        confirmPassword : cpassword,
        profileimg : pimg
    };


    var checkValidation = isDataValid(newUser);

    if(checkValidation){

        var newUser = {
            fname : fname,
            lname : lname,
            email : email,
            gender : gender,
            address : address,
            password : password,
            todo : [],
            profileimg : pimg
        };

        var users = JSON.parse(localStorage.getItem('users')) || [];
        

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log(JSON.parse(localStorage.getItem('users')))
        alert("Registered Successfully!!")
       window.location = "login.html";
    }  
}

function isDataValid(newUser)
{
    var flag = true;

    //firstname validation
    if(newUser.fname == null || newUser.fname == "")
    {
        document.getElementById('fnameError').innerHTML = "*First Name is Mandatory...";
        flag = false;
    }
    else if(!isNaN(newUser.fname)){
        document.getElementById('fnameError').innerHTML = "*Enter aplhabets only...";
        flag = false;
    }
    else { document.getElementById('fnameError').innerHTML="";}



    //LastName validation
    if(newUser.lname == null || newUser.lname == "")
    {
        document.getElementById('lnameError').innerHTML = "*Last Name is Mandatory...";
        flag = false;
    }
    else if(!isNaN(newUser.lname)){
        document.getElementById('lnameError').innerHTML = "*Enter aplhabets only...";
        flag = false;
    }
    else { document.getElementById('lnameError').innerHTML="";}

    //gender validation
    if (newUser.gender == undefined || newUser.gender == "") {
        document.getElementById("genderError").innerHTML = "*Select Gender...";
        flat = false;
    }

    //email validation
    if(newUser.email ==  null || newUser.email == "")
    {
        document.getElementById("emailError").innerHTML ="*Enter Email...";
        flag = false;
    }
    else if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(newUser.email))
    {
        document.getElementById("emailError").innerHTML = "*Invalid Email Address...";
        flag = false;
    }
    else
    {
        
        document.getElementById("emailError").innerHTML = "";
        if(!localStorage.getItem('users'))
        {
            localStorage.setItem('users', JSON.stringify([]));

        }
        else
        {
            var users = JSON.parse(localStorage.getItem('users'));
            for(let i = 0; i < users.length ; i++)
            {
                if(users[i].email==newUser.email)
                {
                    console.log("retrived email : "+ users[i])  // change it after complete -------------------XXXXX----------------
                    document.getElementById("emailError").innerHTML = "*Email already exists...";
                    flag = false;
                }
            }
        }
    
    }
    
    //gender validation
    if(newUser.gender == null || newUser.gender == "" || newUser.gender == undefined)
    {
        document.getElementById('genderError').innerHTML = "*Gender is Mandatory...";
        flag = false;
    }
    else { document.getElementById('genderError').innerHTML="";}

    //address validation
    if(newUser.address == null || newUser.address == "" || newUser.gender == undefined)
    {
        document.getElementById('addressError').innerHTML = "*address is Mandatory...";
        flag = false;
    }
    else { document.getElementById('addressError').innerHTML="";}


    //password validation
    if(newUser.password == null || newUser.password == "")
    {
        document.getElementById('passwordError').innerHTML = "*password is Mandatory...";
        flag = false;
    }
    else if(!(newUser.password.match(/[a-z]/g) && newUser.password.match(/[A-Z]/g) && newUser.password.match(/[0-9]/g) && newUser.password.match( /[^a-zA-Z\d]/g) ))
    {
        document.getElementById('passwordError').innerHTML = "*Required minimum 1 uppercase, 1 Lowercase, 1 digit, 1 special char";
        flag = false;
    }
    else if(newUser.password.length < 8)
    {
        document.getElementById("passwordError").innerHTML = "*Password is short, atlease 8 character Required";
        flag = false;
    }
    else { 
        document.getElementById('passwordError').innerHTML="";
    }

    //confirm passowrd
    if(newUser.password != newUser.confirmPassword){
        document.getElementById('confirmPasswordError').innerHTML = "password not match"
        flag = false;
    }
    else { 
        document.getElementById('confirmPasswordError').innerHTML = "";
    }


    //Profile Image validation
    if(newUser.profileimg == null || newUser.profileimg == "")
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

function getImage() {
    var input = document.getElementById("pimg");
    var imagereader = new FileReader();
    imagereader.readAsDataURL(input.files[0]);
    imagereader.onloadend = function(event) {
        var profileImage = document.getElementById("pimg");
        profileImage.src = event.target.result;
        document.getElementById('previewImage').src = event.target.result;
    }
}

function hideError(divid) {
    document.getElementById(divid).innerHTML = "";
}

function checkGenderValidation()
{
    if(document.getElementById('male').checked){
         return document.getElementById('male').value;
    }
    else if(document.getElementById('female').checked){
        return document.getElementById('female').value;
    }
    else if(document.getElementById('other').checked){
        return document.getElementById('other').value;
    }
}

function togglePassword()
{
    var temp = document.getElementById("password");
    var temp2 = document.getElementById('confirmPassword')
    if (temp.type === "password") {
        temp.type = "text";
        temp2.type = "text";
    }
    else {
        temp.type = "password";
        temp.type = "password";
    }
}



function clearMessage(element)
{
    if(element.id == "email"){
        document.getElementById('emailError').innerHTML = "";
    }

    if(element.id == "fname"){
        document.getElementById('fnameError').innerHTML = "";
    }

    if(element.id == "lname"){
        document.getElementById('lnameError').innerHTML = "";
    }

    if(element.id == "male" || element.id == "female" || element.id == 'other'){
        document.getElementById('genderError').innerHTML = "";
    }

    if(element.id == "address"){
        document.getElementById('addressError').innerHTML = "";
    }

    if(element.id == "password"){
        document.getElementById('passwordError').innerHTML = "";
    }

    if(element.id == "confirmPassword"){
        document.getElementById('confirmPasswordError').innerHTML = "";
    }

}