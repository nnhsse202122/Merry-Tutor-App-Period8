
document.querySelector("#auth-login").addEventListener("click", doLogin);

async function doLogin(){
    let PassportUserData={};
    PassportUserData.email=document.querySelector("#login-info input[name=username]").value;
    PassportUserData.password=document.querySelector("#login-info input[name=password]").value;
    let res = await fetch("/auth/v1/passportUserLogin", { 
        method: "POST",
        body: JSON.stringify({
            PassportUserData
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    var response=await res.json();
    
    if(response.message!="Login success"){
        alert(response.message);
    } 
    else{
        if (response.userDoc.roles.length != 0) {
            if(response.userDoc.roles.includes("tutor")){
                window.location = "/summary/new";
            } else if(response.userDoc.roles.includes("parent")){
                window.location = "/parent/mytuteesummaries";
            } else if(response.userDoc.roles.includes("tutee")){
                window.location = "/tutee/" + response.userDoc._id;
            } else{
                window.location = window.location.origin;
            }
           
        }
    }
    
    
    
   
}