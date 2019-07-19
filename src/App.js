import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state={};
    this.state.list=[];
    this.state.item="";
    this.state.comp=[];
    this.state.percent="";
  }

componentDidMount(){
  axios.get('http://localhost:8080/task').then((res)=>{
    const list = res.data;
    this.setState({
      list
    })
})}  

keyPress(e){
if (e.keyCode === 13){
  let l =this.state.list;
  let obj = {title:this.state.item , status:false, pinned:false, anim:true};
  axios.post('http://localhost:8080/task',obj).then((res)=>{
    if (this.state.item !== ""){
      l.push(res.data);
      this.setState({
        list:l,
        item:""
      })
    }
    console.log(res.data);
  })
    var d = (this.state.comp.length/this.state.list.length)*100;
  if (this.state.list.length === 0 && this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else if (this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else {
    this.setState({
    percent:d })
  }   
}}


   

addToList() {
  let l = this.state.list;
  let obj = {title:this.state.item , status:false, pinned:false, anim:true};

axios.post('http://localhost:8080/task',obj).then((res)=>{
  if (this.state.item !== ""){
    l.push(res.data);
    this.setState({
      list:l,
      item:""
    })
    }
    console.log(res.data);
})

var d = (this.state.comp.length/this.state.list.length)*100;
  if (this.state.list.length === 0 && this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else if (this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else {
    this.setState({
    percent:d
  })
  }
}

inputRead(e) {
  this.setState({
      item:e.target.value
    })
    console.log(this.state.item);
}

deleteInput(i){
  let l = this.state.list;
  let completed = this.state.comp;
  l.anim = false;
  
  axios.delete("http://localhost:8080/task/"+l[i]._id).then((res)=>{
    console.log(res.data)
    if (l[i].status){
      completed.pop();
    }
    l.splice(i,1);
    this.setState({
      list:l,
      comp:completed
    })
  })
  
  var d = (this.state.comp.length/this.state.list.length)*100;
  if (this.state.list.length === 0 && this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else if (this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else {
    this.setState({
    percent:d
  })
}
}

changeOrderUp(i) {
  let l=this.state.list;
  let temp;
  if (i !== 0){
    temp = l[i-1];
    l[i-1]=l[i];
    l[i]=temp;
  }   
  this.setState({
    list:l
  })
}

changeOrderDown(i) {
  let l=this.state.list;
  let temp;
  if (i !== l.length-1){
    temp = l[i+1];
    l[i+1]=l[i];
    l[i]=temp;
  }   
  this.setState({
    list:l
  })
}

changeStatus(i){
  let l= this.state.list;
  l[i].status = !l[i].status;
  axios.put("http://localhost:8080/task/"+l[i]._id,l[i]).then((res)=>{
      console.log(res.data)
      this.setState({
      list:l
    })
  
    if (l[i].status){
      let a = this.state.comp;
      a.push("1");
      this.setState({
        comp:a
      })
    }
    else if (l[i].status===false){
      let a = this.state.comp;
      a.pop();
      this.setState({
        comp:a
      })
    }
     
  var d = (this.state.comp.length/this.state.list.length)*100;
  if (this.state.list.length === 0 && this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else if (this.state.comp.length === 0){
    this.setState({
      percent:"0"
    })
  }
  else {
    this.setState({
    percent:d
  })
}
  })
 
}

pinUnpinElement(i){
  let l = this.state.list;
  let temp;
  
  if (l[i].pinned === false){
    l[0].pinned = false;
    console.log("pinned is true this is if statement");
    l[i].pinned = !l[i].pinned;
    temp = l[0];
    l[0]=l[i];
    l[i]=temp;
  }
  else {
    l[0].pinned = !l[0].pinned;
    console.log("Pinned is false this is else");
    temp = l[0];
    for (let i=0;i<l.length;i++){
        l[i]=l[i+1];
    }
    l[l.length-1]=temp;
    console.log("yes");
  }
  this.setState({
    list:l
  })
} 

// sortName(e){
//   let l = this.state.list;
//   l.sort((a,b)=>a.Date>b.Date);
//   this.setState({
//     list:l
//   })
//   console.log(this.sortName());
// }
  
render(){
return (
<div className="container">
  <h1 className="text-center animated bounceIn delay-.5s">To Do List</h1>
  <div className="row">
    <input type="text" onChange={(e)=>{this.inputRead(e)}} onKeyDown={(e)=>this.keyPress(e)} className="col col-6" value={this.state.item}></input>
    <button onClick={(e)=>{this.addToList()}} className="btn col col-6 btn-secondary hover">Add Task</button>
  </div> 

  <div>
    <h4 className="text-center">Completed Tasks:{this.state.comp.length}/{this.state.list.length}</h4>
  </div> 

  <div className="progress margin-bottom">
    <div className="bar striped warning w-100" style={{width: this.state.percent + '%'}}></div>
  </div>

  {/* <div className="sort">
    <h4>Order by:
    <button className="btn col sortBtn" onClick={(e)=>{this.sortName(e)}}>Name </button>
    <button className="btn col sortBtn">Date </button>
    <button className="btn col sortBtn">Completed </button>
    </h4>
  </div>    */}
  
  <div className="tasks">
    {this.state.list.map((x,i)=>(
    <div className={(x.anim ? "row animated bounceIn delay-.1s":"row animated bounceOut delay-.1s")}>
    <button className={(x.status ? "btn sm-7 btn-success hover":"btn sm-7 col hover")+(x.pinned ? "btn sm-7 col pinned  hover":"btn sm-7 col hover")} 
    onClick={(e)=>{this.changeStatus(i)}} onDoubleClick={(e) =>{this.pinUnpinElement(i)}}><span>{x.title}</span></button>
    <button className="btn col btn-danger hover" onClick={(e)=>{this.deleteInput(i)}}><i className="fas fa-trash-alt"></i></button>
    <button className="btn col btn-warning hover" onClick={(e)=>{this.changeOrderUp(i)}}><i className="fas fa-arrow-up"></i></button> 
    <button className="btn col btn-warning hover" onClick={(e)=>{this.changeOrderDown(i)}}><i className="fas fa-arrow-down"></i></button>
    <button className="btn col btn-warning">{(new Date().getHours().toString())+":"+(new Date().getMinutes().toString())+" "+(new Date().getDate())+"-"+(new Date().getMonth())+"-"+(new Date().getFullYear())}</button>
    </div>))}
  </div>
</div>
);
}   
}

export default App;
