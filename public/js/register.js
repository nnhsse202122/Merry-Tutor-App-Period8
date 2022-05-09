

const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
var shownSlideId = "base-login";

document.querySelector("#auth-register").addEventListener("click", doRegister);

async function doRegister(){
  
    let newPassportUserData={};
    newPassportUserData.given_name=document.querySelector("#signup-info input[name=first-name]").value;
    newPassportUserData.family_name=document.querySelector("#signup-info input[name=last-name]").value;
    newPassportUserData.email=document.querySelector("#signup-info input[name=username]").value;
    newPassportUserData.password=document.querySelector("#signup-info input[name=password]").value;
    //newPassportUserData.graduation_year=document.querySelector("#signup-info input[name=tutee-grad-year]").value;
    let grad_year=document.querySelector("#year").value;
    if (grad_year=="parent"){
        newPassportUserData.graduation_year=null;
    }
    else{
        newPassportUserData.graduation_year=Number(grad_year);
    }
    let decision=document.querySelector("#roles");
    newPassportUserData.roles=decision.value;

    if (newPassportUserData.given_name!="" && newPassportUserData.family_name!="" && newPassportUserData.email!="" && newPassportUserData.password!=""){
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
    else{
        alert("One or more fields cannot be empty");
    }





/*
    if (newPassportUserData.given_name!="" && newPassportUserData.family_name!="" && newPassportUserData.email!="" && newPassportUserData.password!=""){
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

    }
    else{
        alert("One or more fields cannot be empty");
    }
    */
   
}
