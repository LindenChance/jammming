import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{

  constructor(props)
  {
      super(props);
      this.search = this.search.bind(this);
      this.handleTermChange = this.handleTermChange.bind(this);

      this.state = {term: ''};
  }

  search(term)
  {
    //  event.preventDefault();
      this.props.onSearch(term);
  


  }

  handleTermChange(event)
  {

    this.setState({term: event.target.value});


  }

  render()
  {
    return (
      <div className="SearchBar">
        <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search.bind(this, this.state.term)}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
