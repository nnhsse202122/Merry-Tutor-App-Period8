
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
    var user=await res.json();
    console.log(user)
}