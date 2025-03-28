const getMonster = async ()=>{
    monsters=await fetch("http://localhost:3000/");
    monstdata=await monsters.json();
    return monstdata;
}
const createJsonFromForm= (e)=>{
    formInfo=new FormData(e.target);
    formInfoFormatted=Object.fromEntries(formInfo);
    if(!formInfoFormatted['Elder_Dragon']){
        formInfoFormatted['Elder_Dragon']=false;
    }
    else formInfoFormatted['Elder_Dragon']=true;
    formInfoFormatted['Drops']=[];
    for (i=2;i<(Object.keys(formInfoFormatted).length-3)/3+1;i++){
        formInfoFormatted['Drops'][i-2]={};
        formInfoFormatted['Drops'][i-2]['Name']=formInfoFormatted['DropName'+(i-2)];
        formInfoFormatted['Drops'][i-2]['Carve']=formInfoFormatted['Carve'+(i-2)];
        formInfoFormatted['Drops'][i-2]['Rarity']=formInfoFormatted['Rarity'+(i-2)];
    }
    for (i=0;i<Object.keys(formInfoFormatted).length;i++){
        delete formInfoFormatted['DropName'+(i-2)];
        delete formInfoFormatted['Rarity'+(i-2)];
        delete formInfoFormatted['Carve'+(i-2)];
    }
    return formInfoFormatted;
}
const addDropElement=(e)=>{
    li3=document.createElement('li')
    dropList = e.target.closest('ul');
    label2 = document.createElement('label');
    label2.innerHTML = 'Name: ';
    li3.id = 'Drop' + (dropList.childElementCount - 1);
    li3.appendChild(label2);
    input2 = document.createElement('input');
    input2.name = 'DropName' + (dropList.childElementCount - 1);
    input2.type = 'text';
    input2.required = true;
    li3.appendChild(input2);
    li3.appendChild(document.createElement('br'));
    li3.appendChild(document.createElement('br'));
    label2 = document.createElement('label');
    label2.innerHTML = 'Carve: ';
    li3.appendChild(label2);
    input2 = document.createElement('input');
    input2.name = 'Carve' + (dropList.childElementCount - 1);
    input2.type = 'number';
    input2.min = '0';
    input2.max = '1';
    input2.required = true;
    input2.step = '0.01';
    li3.appendChild(input2);
    li3.appendChild(document.createElement('br'));
    li3.appendChild(document.createElement('br'));
    label2 = document.createElement('label');
    label2.innerHTML = 'Rarity: ';
    li3.appendChild(label2);
    input2 = document.createElement('input');
    input2.name = 'Rarity' + (dropList.childElementCount - 1);
    input2.type = 'number';
    input2.min = '1';
    input2.max = '10';
    input2.required = true;
    input2.step = '1';
    li3.appendChild(input2);
    li3.appendChild(document.createElement('br'));
    li3.appendChild(document.createElement('br'));
    dropList.insertBefore(li3, dropList.querySelector('div'));
}
const createForms = async ()=>{
    monsterdata=await getMonster();
    for(i in monsterdata){
        li=document.createElement('li');
        form=document.createElement('form');
        for (j in monsterdata[i]){
            if(j=='_id'){
                continue;
            }
            label=document.createElement('label');
            label.innerHTML=j+': ';
            form.appendChild(label);
            if(j=='Drops'){
                ul=document.createElement('ul');
                for (k in monsterdata[i][j]){
                    li2=document.createElement('li');
                    li2.id='Drop'+k;
                    for(l in monsterdata[i][j][k]){
                        if(l=='_id'){
                            continue;
                        }
                        label=document.createElement('label');
                        label.innerHTML=l+': ';
                        li2.appendChild(label);
                        if(l=='Carve'){
                            input=document.createElement('input');
                            input.name='Carve'+k;
                            input.type='number';
                            input.min='0';
                            input.max='1';
                            input.required=true;
                            input.value=monsterdata[i][j][k][l];
                            input.step='0.01';
                            li2.appendChild(input);
                            li2.appendChild(document.createElement('br'));
                            li2.appendChild(document.createElement('br'));
                        }
                        else if (l=='Rarity'){
                            input=document.createElement('input');
                            input.name='Rarity'+k;
                            input.type='number';
                            input.min='1';
                            input.max='10';
                            input.required=true;
                            input.value=monsterdata[i][j][k][l];
                            input.step='1';
                            li2.appendChild(input);
                            li2.appendChild(document.createElement('br'));
                            li2.appendChild(document.createElement('br'));
                        }
                        else {
                            input=document.createElement('input');
                            input.name='DropName'+k;
                            input.type='text';
                            input.required=true;
                            input.value=monsterdata[i][j][k][l];
                            li2.appendChild(input);
                            li2.appendChild(document.createElement('br'));
                            li2.appendChild(document.createElement('br'));
                        }
                    }
                    ul.appendChild(li2);
                }
                buttondiv=document.createElement('div')
                button=document.createElement('button');
                button.addEventListener('click',(e)=>{
                    e.preventDefault();
                    drop=e.target.closest('ul');
                    drop=drop.querySelectorAll('li')
                    if(drop.length-1>=0){
                        drop[drop.length-1].remove();
                    }
                })
                button.innerHTML='-';
                button.className='dropbutton';
                buttondiv.appendChild(button);
                button=document.createElement('button');
                button.innerHTML='+';
                button.addEventListener('click',(e)=>{
                    e.preventDefault();
                    addDropElement(e);
                })
                button.className='dropbutton';
                buttondiv.appendChild(button);
                ul.appendChild(buttondiv);
                form.appendChild(ul);
            }
            else if(j=='Difficulty'){
                input=document.createElement('input');
                input.name=j;
                input.type='number';
                input.min='1';
                input.max='10';
                input.required=true;
                input.value=monsterdata[i][j];
                input.step='1';
                form.appendChild(input);
                form.appendChild(document.createElement('br'));
                form.appendChild(document.createElement('br'));
            }
            else if(j=='Elder_Dragon'){
                input=document.createElement('input');
                input.name=j;
                input.type='checkbox';
                input.checked=monsterdata[i][j]?1:0;
                form.appendChild(input);
                form.appendChild(document.createElement('br'));
                form.appendChild(document.createElement('br'));
            }
            else {
                input=document.createElement('input');
                input.name=j;
                input.type='text';
                input.required='true';
                input.value=monsterdata[i][j];
                form.appendChild(input);
                form.appendChild(document.createElement('br'));
                form.appendChild(document.createElement('br'));
            }
            
        }
        button=document.createElement('button');
        const index=i;
        button.addEventListener('click',async (e)=>{
            e.preventDefault();
            if(sessionStorage.getItem('info')!==null){
                const resp=await fetch('http://localhost:3000/'+monsterdata[index]['_id'],{
                    method:"DELETE",
                    withCredentials: true,
                    credentials: "include"
                })
                if(resp.status!=200){
                    alert('Please login to use this function');
                }
                else{
                    location.reload();
                }
            }
            else {
                alert("Please login to use this function");
            }
        })
        button.innerHTML='Delete';
        button.className='delete';
        form.appendChild(button);
        button=document.createElement('button');
        button.type='submit';
        button.innerHTML='Submit';
        button.className='update';
        form.appendChild(button);
        form.addEventListener('submit',async (e)=>{
            e.preventDefault();
            if(sessionStorage.getItem('info')!==null){
                formInfo=createJsonFromForm(e);
                const resp=await fetch('http://localhost:3000/'+monsterdata[index]['_id'],{
                    method:"PATCH",
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify(formInfo),
                    withCredentials: true,
                    credentials: "include"
                });
                if(resp.status!=200){
                    alert('Please login to use this function');
                }
                else{
                    location.reload();
                }
            }
            else {
                alert("Please login to use this function");
            }
        })
        li.appendChild(form);
        document.getElementById('forms').appendChild(li);
        
    }
}
window.onload=async ()=>{
    createForms();
    document.getElementById('modalOverlay').style.display='none';
    document.getElementById('openButton').addEventListener('click',(e)=>{
        e.preventDefault();
        modal=document.getElementById('modalOverlay');
        modal.style.display='flex';
    });
    document.getElementById('closeButton').addEventListener('click',(e)=>{
        e.preventDefault();
        modal=document.getElementById('modalOverlay');
        modal.style.display='none';
    });
    monsterForm=document.getElementsByClassName('createMonster');
    monsterForm[0].addEventListener('submit',async (e)=>{
        e.preventDefault();
        formInfo=createJsonFromForm(e);
        const resp=await fetch('http://localhost:3000/',{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(formInfo),
                withCredentials: true,
                credentials: "include"
        });
        if(resp.status!=200){
            alert('Please login to use this function');
        }
        else{
            location.reload();
        }
    })
    addButton=document.getElementById('addButton');
    addButton.addEventListener('click',(e)=>{
        e.preventDefault();
        addDropElement(e);
    })
    minButton=document.getElementById('minButton');
    minButton.addEventListener('click',(e)=>{
        e.preventDefault();
        drop=e.target.closest('ul');
        drop=drop.querySelectorAll('li')
        if(drop.length-1>=0){
            drop[drop.length-1].remove();
        }
    })
}
