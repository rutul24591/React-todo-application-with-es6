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
      console.log("items component did mount called:::", this.state);
  }

  createNewItem(){
    console.log("Add item button clicked::::", this.state);
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
    console.log("Update item button clicked::::", this.state);
    fetch(`${this.todoApiUrl}/items/${this.state.selectedItemId}`,{
      method: 'PUT',
      headers: new Headers({ 'Content-Type':'application/json', 'charset':'utf-8'}),
      body: JSON.stringify({title: this.state.title})
    }).then(response => {
      if(!response.ok){
        alert("An Error occurred while updating item");
      }else{
        const { items, title, selectedItemId } = this.state;
        console.log("items:::", this.state.items);
        const index =  items.findIndex((item) => item.id === selectedItemId);

        // array.splice(index, howmany, item1, ....., itemX)   index: at which position the item is to be added/removed
        // howmany: no of item to be added or removed
        // item1... itemx  item(s) to be added or removed.
        items.splice(index, 1, { id: selectedItemId, title: title});

        // set the state with the updated item list(correctly positioned as previous item)
        this.setState({items: items});
      }
    })
  }

  deleteSelectedItem(){
      console.log("Delete item button clicked::::", this.state);
      fetch(`${this.todoApiUrl }/items/${ this.state.selectedItemId }`, {
        method: 'DELETE'
      }).then(response => {
        if(!response.ok ){
          alert('An error occured while deleting item');
        }else{
          const { items, selectedItemId } = this.state;
          const index = items.findIndex((item) => item.id === selectedItemId);
          items.splice(index, 1);
          console.log("items after splicing in delete:::", items)
          this.setState({
            items: items,
            title: '',
            selectedItemId: null
          })
        }
      })
  }
  
  render(){
    console.log("this.state in render::", this.state);
    return (
      <div className="app-container">
        <h1>Todo List</h1>
        <ul>
          { this.state.items.map((item) =>
            <li key={ item.id } className="col-12" style={{"listStyle":"none"}}>
              {/* <a href="#" onClick={() => this.setState({ selectedItemId : item.id, title: item.title })}
              className={this.state.selectedItemId === item.id ? 'selected': ''}> */}
                <input type="checkbox" className={this.state.selectedItemId === item.id ? 'selected mr-3': 'mr-3'}
                onClick={() => this.setState({ selectedItemId : item.id, title: item.title })}></input>
                { item.title }
            </li>
          )}
        </ul>
        <div className=" col-4 d-inline-flex justify-content-around align-items-center">
          <label>Title:</label>
          <input type="text" value={ this.state.title } onChange={(event) => this.setState({title: event.target.value })} />
          <button className="btn btn-primary" onClick={ this.createNewItem }>Add New</button>
          <button className="btn btn-secondary" onClick={ this.updateSelectedItem }>Update</button>
          <button className="btn btn-danger" onClick={ this.deleteSelectedItem }>Delete</button>
        </div>
      </div>
    );
  }
}

export default App;
