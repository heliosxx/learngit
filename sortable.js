var bindEvent={
    "add":function(element, type, handle, isBubble){
            if(!isBubble){
                isBubble=false;
            }
            if(element.addEventListener){
                element.addEventListener(type, handle, isBubble);
            }else if(element.attachEvent){
                Transit=function(){
                    handle.call(dom);
                }
                element.attachEvent("on"+type, handle, Transit);
            }else{
                element["on"+type]=handle;
            }
        },
    "remove": function(element, type, handle, isBubble){
            if(!isBubble){
                isBubble=false;
            }
            if(element.removeEventListener){
                element.removeEventListener(type,handle,isBubble);
            }
            else if(element.detachEvent){
                element.detachEvent('on'+type,Transit);
            }
            else{
                element['on'+type]=null;
            }
        }
};
//运行
window.onload=function(){
    //点击的li变背景
    var nav=document.getElementById("baidu");
    // nav.addEventListener("mousedown",handledown,false);
    // nav.addEventListener("mouseup",handleup,false);
    bindEvent.add(nav, "mousedown", handledown, false);
    bindEvent.add(nav, "mouseup", handleup, false);
    // nav.onmousedown=handledown;
    // nav.onmouseup=handleup;
    // 实现li元素的拖动
    var lists=nav.getElementsByTagName("li"),
        len=lists.length;
    for(var i=0; i<len; i++){
        var list=lists[i];
        list.draggable=true;//设置所有li都是可以拖动的
        // list.dragDrop=true;
    }
    // nav.addEventListener("dragstart",pickup,false);
    // nav.addEventListener("dragend",putdown,false);
    bindEvent.add(nav, "dragstart", pickup, false);
    bindEvent.add(nav, "dragend", putdown, false);
    //临时实时显示光标的坐标
    var box=document.createElement("div");
    box.appendChild(document.createTextNode("显示坐标："));
    document.body.appendChild(box);
    // nav.addEventListener("mousemove",function(){
    //     var e=event||window.event;
    //     var x,y;
    //     x=e.clientX-e.currentTarget.offsetLeft;
    //     y=e.clientY-e.currentTarget.offsetTop;
    //     box.innerText="显示坐标为：x坐标"+x+"y坐标"+y;
    // },false);
    
    bindEvent.add(nav, "mousemove", function(){
        var e=event||window.event;
        var x,y;
        x=e.clientX-e.currentTarget.offsetLeft;
        y=e.clientY-e.currentTarget.offsetTop;
        box.innerText="显示坐标为：x坐标"+x+"y坐标"+y;
    }, false);

    var arrow=document.getElementsByClassName("arrow"),
        arrowlen=arrow.length,
        imagelist=document.getElementsByClassName("images")[0].lastElementChild,
        len=imagelist.children.length,
        bigimage=document.getElementsByClassName("bigimage")[0],
        pickbox=document.getElementsByClassName("pickbox")[0];
    for(var i=0; i<arrowlen; i++){
        // arrow[i].lastElementChild.addEventListener("click",arrowHandle,false);
        bindEvent.add(arrow[i].lastElementChild, "click", arrowHandle ,false);
    }
    for(var i=0; i<len; i++){
        // imagelist.children[i].lastElementChild.addEventListener("mousemove", bigImageHandle, false);
        bindEvent.add(imagelist.children[i].lastElementChild, "mousemove", bigImageHandle, false);
    }
    // bigimage.addEventListener("mousemove",showBigImage,false);
    bindEvent.add(bigimage, "mousemove", showBigImage, false);
    //
};
//定义一堆函数，关于类名的操作可以使用HTML5中的classList对象实现，更简便
function addClassName(element,name){
        if(element.className && element.className!=""){
            if(element.className.indexOf(" "+name)<0){
                element.className += " "+name;
            }
        }else{
            element.className=name;
        }
    }
function removeClassName(element,name){
    var tname=element.className;
    var index=tname.indexOf(name);
    if(index>0){
        element.className=tname.split().splice(index-1,name.length).join("");            
    }else if(index==0){
        element.className=tname.slice(name.length);
    }
}
function handledown(){
        var e=event||window.event;
        // e.target.addClassName("select");
        var domx=e.target;
        // alert(domx.nodeName);
        addClassName(domx,"select");
    }
function handleup(){
    var e=event||window.event;
    removeClassName(e.target,"select");
}
function pickup(){
    var e=event||window.event;
    e.target.classList.add("pickup");
    // e.target.setAttribute("data-x",e.clientX-e.currentTarget.offsetLeft);
    // e.target.setAttribute("data-y",e.clientY-e.currentTarget.offsetTop);
    e.target.dataset.x=e.clientX-e.currentTarget.offsetLeft;
    e.target.dataset.y=e.clientY-e.currentTarget.offsetTop;
    //此处用于记录点击点的坐标
}
function putdown(){
    var e=event||window.event;
    //计算坐标算出drop处应该所属的下标
    var x,y,height,diffx,diffy,post,oldy;
    x=e.clientX-e.currentTarget.offsetLeft;
    y=e.clientY-e.currentTarget.offsetTop;
    oldy=parseInt(e.target.dataset.y);
    height=e.target.offsetHeight+parseInt(document.defaultView.getComputedStyle(e.target,null).marginTop);
    diffx=parseInt(e.target.dataset.x);
    diffy=parseInt(e.target.dataset.y)%height;
    post=Math.floor((y-diffy)/height);
    //  alert("结束点x"+x+"结束点y"+y+"位置"+post+"单行高度"+height+"点击点y"+oldy);
    if(y < oldy){
        replace(e.target,e.target.parentNode.children[post],true);
    }else if(y > oldy+height){
        replace(e.target,e.target.parentNode.children[post],false);
    }
}
function insertAfter(element,relative){
    var parent=relative.parentNode;
    if(parent.lastElementChild==relative){
        parent.appendChild(element);
    }else{
        parent.insertBefore(element,relative.nextSibling);
    }
}
function replace(element,relative,up){
    //element表示被拖起来的li，post表示它drop的位置所属的下标
    //注意，如果往上移动适用insertBefore，往下移动时候适用insertBefore的下一项
    var parent=element.parentNode,
        newer=parent.removeChild(element);
    if(up==true){
        parent.insertBefore(newer,relative);
    }else{
        insertAfter(newer,relative);
    }
    newer.classList.remove("pickup");
}
// document.getElementById("baidu").parentElement.lastElementChild