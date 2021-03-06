//创建ajax请求对象
function createRequest(){
  try{
    request = new XMLHttpRequest();
  }catch(tryMS){
    try{
      request = new ActiveXObject("Msxml2.XMLHTTP");
    }catch(otherMS){
      try{
        request = new ActiveXObject("Microsoft.XMLHTTP");
      }catch(failed){
        request = null;
      }
    }
  }
  return request;
}

//判断是否为数组
function isArray(arg){
  if(arg.constructor.toString().match(/array/i) != null){
    return true;
  }else{
    return false;
  }
}

//注册事件处理程序
function addEventHandler(obj, eventname, handler){
  if(document.addEventListener){
    obj.addEventListener(eventname, handler, false);
  }else if(document.attachEvent){
    obj.attachEvent("on"+eventname, handler);
  }
}

//获得触发事件的目标对象
function getTargetObject(e){
  try{
    return e.target;
  }catch(ie){
    try{
      //IE 7 or later
      return e.srcElement;
    }catch(otherie){
      //early version of IE
      return window.event.srcElement;
    }
  }
}

//判断某元素是否有某类,构造函数的正则用到双重转义
function haveClass(ele,cls){
  var reclass=new RegExp("\\b"+cls+"\\b");
  return reclass.test(ele.className);
}

//以数组形式实现自定义事件，触发和删除，功能同addEventListener
var Event={
  _listener:{},
  addEvent:function(type,fn){
    if(this._listener[type]==undefined){
      this._listener[type]=[];
    }
    if(typeof fn=='function'){
      this._listener[type].push(fn);
    }
    return this;
  },
  fireEvent:function(type){
    var arr=this._listener[type];
  if(Object.prototype.toString.call(arr)=="[object Array]"){
    for(var i=0;i<this._listener[type].length;i++){
        arr[i]();
    }
    return this;
   }
  },
  removeEvent:function(type,fn){
    // if(this._listener[type].indexOf(fn)!=-1){
    //     var index=this._listener[type].indexOf(fn);
    //     this._listener[type].splice(index,1);
    //   }
    var arr=this._listener[type];
    if(typeof type=='string'&&arr instanceof Array){
        if(typeof fn=='function'){
          //不能用index获取，这样只是字符串匹配，而删除函数要同一个指向的
          // var index=this._listener[type].indexOf(fn);
          for(var i=0,length=arr.length;i<length;i++){
            if(arr[i]===fn){
              this._listener[type].splice(index,1);
              break;
            }
          }
        }else{
          //只提供type参数，删除整个数组，用户自定义的属性可以被删除
          delete this._listener[type];
        }
        return this;
     }
    }
}

//得到介于min和max之间的随机整数
function randomNum(min,max){
  var num=max-min+1;
  return Math.floor(Math.random()*num+min);
}

/*过滤掉数组中重复项，返回新数组
利用数组的indexOf方法总是返回第一个与参数匹配的元素索引。
参数arr：要被处理的数组
参数repArr：重复的项的数组，初始为空
*/
function filterRepeatArray(arr,repArr){
   var newArr=[];
   for(var i=0;i<arr.length;i++){
      if(arr.indexOf(arr[i])==i){
        newArr.push(arr[i]);
      }else{
        if(repArr.indexOf(arr[i])<0){
           repArr.push(arr[i]);
        }
      }
   }
   return newArr;
}

/*将某个类数组集合转换为数组类型，返回新的数组类型集合，通过传入后两项参数可实现获取类型为数组的集合部分内容，兼容所有浏览器。
collections：类数组集合，只传入一个参数默认返回原集合的所有项
start：起始下标，可省略
end：结束下标，返回该下标之前的项。可省略
*/
function transToArr(collections,start,end){
   var length=arguments.length;
   if(length==0){
       return;
   }else{
      try{
         if(length==1){
          return Array.prototype.slice.call(collections);
         }else{
          //判断start，end类型
          if(typeof arguments[1]=='number'){
              if(typeof arguments[2]=='number'){
                  return Array.prototype.slice.call(collections,start,end);
              }else{
                //end参数不是number类型时，slice返回length之前的项
                  end=collections.length;
                  return Array.prototype.slice.call(collections,start,end);
             }
          }
        }
      }catch(ex){
        //<=IE8的某些COM对象
          var arr=new Array();
          for(var i=0;i<collections.length;i++){
            arr.push(collections[i]);
          }
       }
      return arr;
   }
}

//不用把字符串转为数组实现从一个字符串中选出出现次数最多的字符及次数
function maxCountValue(str){
  var arr=[],max=0,parrent,chr;
  for(var i=0;i<str.length;i++){
  if(arr.indexOf(str[i])<0){
     parrent=new RegExp(str[i],'g');
     if(str.match(parrent).length>max){
       max= str.match(parrent).length;
       chr=str[i];
     }
     arr.push(str[i]);
  }
 }
 console.log(chr,max)
}

//获取页面可见视口宽高，向后兼容
function visualViewport(){
  var visualobj={};
  visualobj.pageWidth=window.innerWidth,
  visualobj.pageHeight=window.innerHeight;
  //<=IE8不支持上面两种属性
  if(typeof visualobj.pageWidth!="number"){
        if(document.compatMode=="CSS1Compat"){
            visualobj.pageWidth=window.documentElement.clientWidth;
            visualobj.pageHeight=window.documentElement.clientHeight;
        }else{
            //兼容三大主流浏览器的混杂模式
            visualobj.pageWidth=window.body.clientWidth;
            visualobj.pageHeight=window.body.clinetHeight;
        }
    }
     return visualobj;
}

/*实现深度克隆，原型指向，自身属性，以及自身属性的特性值
给Object扩展一个clone方法，返回克隆后的新对象
注意给forEach中要执行的函数传上下文参数this，否则默认为undefined（严格模式下）或全局对象window
*/
Object.prototype.deepClone=function(){
  var newobj=Object.create(Object.getPrototypeOf(this));
  var propNames=Object.getOwnPropertyNames(this);
  propNames.forEach(function(item){
    var des=Object.getOwnPropertyDescriptor(this,item);
    Object.defineProperty(newobj,item,des);
  },this);
  return newobj;
}

/*从给定URL中找出指定的键对应的值*/
function QuerySearch(url,name){
  var arr=url.split('?')[1].split('&'),
      str=name+'=',index,start;
  for(var i=0;i<arr.length;){
    index=arr[i].indexOf(str);
    if(index<0){
      //如果str不在该项中，进入下一项
      i++;
    }else{
      start=index+str.length;
      return arr[i].slice(start);
    }
  }
  //如果都循环完还没找到则返回""
  return "";
}

/*给定m~n的水仙花数*/
function shuixianhua(m,n){
   var num,sum,sxarr=[];
   for(var i=m;i<=n;i++){
      var arr=i.toString().split('');
      //每次在这里初始化为0
      sum=0;
      for(var j=0;j<arr.length;j++){
        num=Math.pow(parseInt(arr[j]),3);
        sum+=num;
        if(sum==i) sxarr.push(i);
      }
   }
   return sxarr;
}

/*随机返回16进制颜色,因为用到arguments.callee所以严格模式下会出错。
实现：每次都要判断一下长度作为限制条件，递归实现类似这样 '4'&&'43'&&'43a'... 最后取值为最最右边的字符串
*/
function getRandomColor(){
  var color=function(c){
    return (c+='0123456789abcdef'[Math.floor(Math.random()*16)])&&c.length==6?c:arguments.callee(c);
  }('');
  return '#'+color;
}

//判断一个数组能都分成两个数组数组，要求这两个数组的每组总值相同
function splitarr(arr){
      var sum = 0,aver=0,s=0;
      arr.forEach(function(item,i){
         sum+=item;
       });
      aver = sum/2;
      //单值
      if(arr.indexOf(aver)>=0){
            return true;
      }
      for(var i =0;i<arr.length;i++){
         //多值
           s+=arr[i];
           if(s == aver){
            return true;
           }
      }
      return false;
}

//反转链表

//给你n个数找出一个连续的数列，使数列的和最大

//n个数，找出出现次数最多那个数
function maxTime(arr){
  //arr先排序,快排
  arr = quickSort(arr, 0, arr.length-1);
  var max=0,start,end;
  for(var i=0; i<arr.length;){
    start = arr.indexOf(arr[i]);
    end = arr.lastIndexOf(arr[i]);
    if(end - start +1 >= max){
      max = end-start+1;
      num = arr[i];
    }
    i+= end -start +1;
  }
  return num;
}
//快排
function quickSort(arr, left, right){
  if(left >= right){
    return ;
  }

    var i = left,
        j = right,
        jz = arr[left],t;
    while(i!=j){
      while(i<j&&arr[j]>=jz){ j--;}
      while(i<j&&arr[i]<=jz){ i++;}
      //交换
      t = arr[j];
      arr[j] = arr[i];
      arr[i] = t;
    }
    //i =j
    arr[left] = arr[i];
    arr[i] = jz;
    //递归
    quickSort(arr, left, i-1);
    quickSort(arr, i+1, right);

    return arr;

}

//将一个字符串转化为数字
function transNum(str){
  var str0 = '0',
      start = str0.charCodeAt(), arr = [];
  Array.prototype.forEach.call(str, function(item, idx){
    arr.push(item.charCodeAt() - start);
  });
  return Number(arr.join(''));
}

/*
判断某节点是否是另外一个节点的后代的兼容性代码
refNode：参照节点
targetNode：要检查的节点
*/
function contains(refNode, targetNode){
  if(typeof refNode.contains == 'function'){
    return refNode.contains(targetNode);
  }else if(typeof refNode.compareDocumentPosition == 'function'){
    return !!(refNode.compareDocumentPosition(targetNode)&16);
  }else{
    var node = targetNode.parentNode;
    do{
      if(node == refNode){
        return true;
      }else{
        node = node.parentNode;
      }
    }while(node!== null);
    return false;
  }
}
