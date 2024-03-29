

const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
var shownSlideId = "base-login";

document.querySelector("#auth-register").addEventListener("click", doRegister);
/*
async function doRegister(){
    let newPassportUserData={};
    //Turn the input data into a newPassportUserData object
    newPassportUserData.given_name=document.querySelector("#signup-info input[name=first-name]").value;
    newPassportUserData.family_name=document.querySelector("#signup-info input[name=last-name]").value;
    newPassportUserData.email=document.querySelector("#signup-info input[name=username]").value;
    newPassportUserData.password=document.querySelector("#signup-info input[name=password]").value;
    let grad_year=document.querySelector("#year").value;
    if (grad_year=="parent"){
        newPassportUserData.graduation_year=null;
    }
    else{
        newPassportUserData.graduation_year=Number(grad_year);
    }
    let decision=document.querySelector("#roles");
    newPassportUserData.roles=decision.value;
    //check if the fields are empty
    if (newPassportUserData.given_name!="" && newPassportUserData.family_name!="" && newPassportUserData.email!="" && newPassportUserData.password!=""){
        //graduation_year of parents should be null
        if(newPassportUserData.roles[0]=="p"){
            newPassportUserData.graduation_year=null;
            let res = await fetch("/auth/v1/checkForDuplicate", { 
                method: "POST",
                body: JSON.stringify({
                    newPassportUserData
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            var user = await res.json();
            if (user=="yes"){
                alert("A user with the same email already exists")
            }
            else{
                let res = await fetch("/auth/v1/passportUser", { 
                    method: "POST",
                    body: JSON.stringify({
                        newPassportUserData
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                var user = await res.json();
                console.log(user);
                window.location = "/registrationConfirmation";
            }
        }
        //graduation_year for tutee and tutors can't be null
        if (newPassportUserData.roles[0]=="t" && newPassportUserData.graduation_year==null){
            alert("You are not a parent!");
        }
        else{
            //sends a request to server to check for duplicates 
            let res = await fetch("/auth/v1/checkForDuplicate", { 
                method: "POST",
                body: JSON.stringify({
                    newPassportUserData
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            var user = await res.json();
            if (user=="yes"){
                alert("A user with the same email already exists")
            }
            else{
                //sends a request to server to insert the user object to the MongoDB Database
                let res = await fetch("/auth/v1/passportUser", { 
                    method: "POST",
                    body: JSON.stringify({
                        newPassportUserData
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                var user = await res.json();
                console.log(user);
                window.location = "/registrationConfirmation";
            }   
        }
    }
    else{
        alert("One or more fields cannot be empty");
    }
}
*/
async function doRegister(){
    let newPassportUserData={};
    //Turn the input data into a newPassportUserData object
    newPassportUserData.given_name=document.querySelector("#signup-info input[name=first-name]").value;
    newPassportUserData.family_name=document.querySelector("#signup-info input[name=last-name]").value;
    newPassportUserData.email=document.querySelector("#signup-info input[name=username]").value;
    newPassportUserData.password=document.querySelector("#signup-info input[name=password]").value;
    newPassportUserData.password2=document.querySelector("#signup-info input[name=password2]").value;
    let grad_year=document.querySelector("#year").value;
    if (grad_year=="parent"){
        newPassportUserData.graduation_year=null;
    }
    else{
        newPassportUserData.graduation_year=Number(grad_year);
    }
    let decision=document.querySelector("#roles");
    newPassportUserData.roles=decision.value;
    if (!checkEmpty(newPassportUserData)){
        alert("One or more fields cannot be empty!")
    }
    else{
        if (newPassportUserData.roles[0]=="t" && newPassportUserData.graduation_year==null){
            alert("You are not a parent!");
        }
        else{
            if(newPassportUserData.password!=newPassportUserData.password2){
                alert("The passwords do not match!");
            }
            else{
                if (!ValidateEmail(newPassportUserData.email)){
                    alert("Please enter a valid email!");
                }
                else{
                    if(await checkForDuplicate(newPassportUserData)){
                        alert("A user with the same email already exists!");
                    }
                    else{
                        let res = await fetch("/auth/v1/passportUser", { 
                            method: "POST",
                            body: JSON.stringify({
                                newPassportUserData
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                        var user = await res.json();
                        console.log(user);
                        window.location = "/registrationConfirmation";
                    }
                }
               
            }
        }

    }
}
function checkEmpty(newPassportUserData){
    if (newPassportUserData.given_name!="" && newPassportUserData.family_name!="" && newPassportUserData.email!="" && newPassportUserData.password!=""){
        return true;
    }
    else{
        return false;
    }
}

async function checkForDuplicate(newPassportUserData){
    let res = await fetch("/auth/v1/checkForDuplicate", { 
        method: "POST",
        body: JSON.stringify({
            newPassportUserData
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    var status=await res.json();
    if (status=="yes"){
        return true;
    }
    else{
        return false;
    }
}

function ValidateEmail(inputText)
{
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
if(inputText.match(mailformat))
{

return true;
}
else
{
return false;
}
}
