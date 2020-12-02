function createList(title, list ){
    const html = document.getElementsByTagName('body')[0];
    const titleTeg = document.createElement('h2');
    titleTeg.textContent = title;
    html.appendChild(titleTeg);

    const ul = document.createElement('ul');
    html.appendChild(ul);
    for(let i = 0; i < list.length; i++){
        const li = document.createElement('li');
        li.textContent = list[i].value;
        if(ul.children){
            ul.appendChild(li);
        }
        if(list[i].children){
            createChild(list[i], li);
        }
    }
}

function createChild(node, li){
    
    const ul = document.createElement('ul');
    for(let i = 0; i < node.children.length; i++){
        childLi = document.createElement('li');
        childLi.textContent = node.children[i].value;
        ul.appendChild(childLi);
        li.appendChild(ul);
        if(node.children[i].children){
            createChild(node.children[i], childLi);
        } 
    }
    li.addEventListener('click',function(){
        this.parentElement.querySelector('ul').classList.toggle("hidden");
    })
}

const list = [
    {
       value: 'Пункт 1.',
       children: null,
    },
    {
       value: 'Пункт 2.',
       children: [
          {
             value: 'Подпункт 2.1.',
             children: null,
          },
          {
             value: 'Подпункт 2.2.',
             children: [
                {
                   value: 'Подпункт 2.2.1.',
                   children: null,
                },
                {
                   value: 'Подпункт 2.2.2.',
                   children: null,
                }
             ],
          },
          {
             value: 'Подпункт 2.3.',
             children: null,
          }
       ]
    },
    {
       value: 'Пункт 3.',
       children: null,
    }
];
createList('Extra Task', list);
