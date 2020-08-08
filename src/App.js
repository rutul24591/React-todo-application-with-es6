/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      items: [],
      title:'',
      selectedItemId: null
    }
    this.todoApiUrl = 'https://todowebapi.herokuapp.com';
    this.createNewItem = this.createNewItem.bind(this);
    this.deleteSelectedItem = this.deleteSelectedItem.bind(this);
    this.updateSelectedItem = this.updateSelectedItem.bind(this);
  }

  componentDidMount(){
    fetch(`${this.todoApiUrl}/items`)
      .then(response => response.json())
      .then(items => this.setState({items}));
  }

  createNewItem(){
    fetch(`${this.todoApiUrl}/items`,{
      method: "POST",
      headers: new Headers({'Content-Type': 'application/json','charset':'utf-8'}),
      body: JSON.stringify({title: this.state.title })
    }).then(response => {
      if(!response.ok){
        alert("an error occured while creating new todo item");
      }else{
        return response.json();
      }      
    }).then(createdItem => {
      this.setState(prevState => ({
        items: [...prevState.items, {id:createdItem.id, title: createdItem.title}],title:''
      }))
    })
  }

  updateSelectedItem(){
    fetch(`${this.todoApiUrl}/items/${this.state.selectedItemId}`,{
      method: 'put',
      headers: new Headers({ 'Content-Type':'application/json', 'charset':'utf-8'}),
      body: JSON.stringify({title: this.state.title})
    }).then(response => {
      if(!response.ok){
        alert("An Error occurred while updating item");
      }else{
        const { items, title, selectedItemId } = this.state;
        const index =  items.findIndex((item) => item.id === selectedItemId);
        console.log("index::::", index);
        items.splice(index, 1, { id: selectedItemId, title: title});
        this.setState({items: items});
      }
    })
  }

  deleteSelectedItem(){
      fetch(`${this.todoApiUrl }/items/${ this.state.selectedItemId }`, {
        method: 'DELETE'
      }).then(response => {
        if(!response.ok ){
          alert('An error occured while deleting item');
        }else{
          const { items, selectedItemId } = this.state;
          const index = items.findIndex((item) => item.id === selectedItemId);
          items.splice(index, 1);
          this.setState({
            items: items,
            title: '',
            selectedItemId: null
          })
        }
      })
  }
  
  render(){
    return (
      <div className="app-container">
        <h1>Todo List</h1>
        <ul>
          { this.state.items.map((item) =>
            <li key={ item.id } style={{"listStyle":"none"}}>
              {/* <a href="#" onClick={() => this.setState({ selectedItemId : item.id, title: item.title })}
              className={this.state.selectedItemId === item.id ? 'selected': ''}> */}
                <input type="checkbox" className={this.state.selectedItemId === item.id ? 'selected': ''}
                onClick={() => this.setState({ selectedItemId : item.id, title: item.title })}></input>
                { item.title }
            </li>
          )}
        </ul>
        <div>
          <label>Title:</label>
          <input type="text" value={ this.state.title } onChange={(event) => this.setState({title: event.target.value })} />
          <button onClick={ this.createNewItem }>Add New</button>
          <button onClick={ this.updateSelectedItem }>Update</button>
          <button onClick={ this.deleteSelectedItem }>Delete</button>
        </div>
      </div>
    );
  }
}

export default App;
