window.onload=()=>{
    loginButton=document.getElementById('loginButton');
    loginButton.addEventListener('mouseover',(e)=>{
        e.target.style.backgroundColor='rgb(238, 207, 32)';
    });
    loginButton.addEventListener('mouseout',(e)=>{
        e.target.style.backgroundColor='yellow';
    });
    document.getElementById('modalOverlay').style.display='none';
    if(sessionStorage.getItem('info')===null){
        loginButton.addEventListener('click',(e)=>{
            e.preventDefault();
            modal=document.getElementById('modalOverlay');
            modal.style.display='flex';
        });
    }
    else {
        loginButton.innerHTML='Logout';
        loginButton.addEventListener('click',async (e)=>{
            e.preventDefault();
            const resp=await fetch('http://localhost:3000/logout',{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                withCredentials: true,
                credentials: "include"
            })
            console.log(resp.status);
            if(resp.status!=200){
                alert('Logout failed');
            }
            else{
                sessionStorage.removeItem('info');
                location.reload();
            }

        });
    }
    document.getElementById('closeButton').addEventListener('click',(e)=>{
        e.preventDefault();
        modal=document.getElementById('modalOverlay');
        modal.style.display='none';
    });
    registerButton=document.getElementById('register');
    registerButton.addEventListener('click',async (e)=>{
        e.preventDefault();
        loginInfo={};
        loginInfo['username']=e.target.parentElement.username.value;
        loginInfo['password']=e.target.parentElement.password.value;
        loginInfo['info']="";
        let resp=await fetch("http://localhost:3000/register",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(loginInfo),
            withCredentials: true,
            credentials: "include"
        })
        if(resp.status==400){alert("Username is already in use")}
        else if(resp.status!=200){alert("Failed to register")}
        else{
            sessionStorage.setItem('info',"");
            location.reload();
        }
    });
    loginForm=document.getElementById('login');
    loginForm.addEventListener('submit',async (e)=>{
        loginInfo={};
        loginInfo['username']=e.target.username.value;
        loginInfo['password']=e.target.password.value;
        e.preventDefault();
        data=await fetch("http://localhost:3000/login",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(loginInfo),
            withCredentials: true,
            credentials: "include"
        });
        let dataTxt=await data.text();
        if(dataTxt!="Incorrect login info"){
            sessionStorage.setItem('info',dataTxt);
            location.reload();
        }
        else {
            alert("Incorrect login info");
        }
    })
    title=document.getElementsByTagName('h1');
    title=title[0];
    interv=setInterval((title)=>{
        title.style.color='rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')';
    },500,title)
    setTimeout(()=>clearInterval(interv),10000);
}