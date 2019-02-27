import React from 'react';
import './App.css';

const URL_PATH = 'https://www.googleapis.com/books/v1/volumes';

class BookSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input: '',
      search: false,
      error: false,
      items: [],
    };
    this.addText = this.addText.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  addText(e) {
    this.setState({input: e.target.value})
    this.setState({error: false})
  };

  onSearch() {
    if (this.state.input === ''){
      this.setState({error: true})
      this.setState({search: false})
    } else {
      this.setState({search: true})
      const search = this.state.input.split(" ").join('+');
      fetch(`${URL_PATH}?q=${search}&maxResults=10`)
        .then(response => response.json())
        .then(json => {
          let { items } = json;
          this.setState({ items });
          console.log(items);
        })
    }
  };

  render () {
    const isThereInput = this.state.error;
    const validSearch = this.state.search;
    let info;
    if (isThereInput) {
      info = <SearchError onSearch={this.onSearch} />; 
    } else if (validSearch) {
      info = <Books onSearch={this.onSearch} items={this.state.items} />;
    } else {
      info = <NoResults />;
    }
    return (
      <div id="wrapper">
        <h1>BOOK FINDER</h1>
        <Search 
          input={this.state.input} 
          onSearch={this.onSearch} 
          addText={this.addText}/>
        {info}
      </div>
    );
  }
}

function Search(props){
  return (
    <div id="search-wrapper">
      <input type="text" id="search" placeholder="Search by book title or author" onChange={props.addText}/>
      <button id="search-button" type="submit" onClick={props.onSearch}>SEARCH</button>
    </div>
  )
}

function NoResults(props){
  return (
    <div className="noResults-wrapper">
      <h2>Please enter title or author to find books</h2>
    </div>
  );
}

function SearchError(props){
  return (
    <div className="error-wrapper">
        <h2>Please enter a book or an author and try again, thanks!</h2>
    </div>
  );
}

function Books(props){
  const bookItems = props.items;
  const bookCards = bookItems.map((entry) => {
    let image = entry.volumeInfo.imageLinks === undefined ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png' : entry.volumeInfo.imageLinks.smallThumbnail;
    let keyid = entry.id === undefined ? 'No ID' : entry.id;
    let published = entry.volumeInfo.publisher === undefined ? 'No Publisher Provided' : entry.volumeInfo.publisher;
    let info = entry.volumeInfo.infoLink === undefined ? '#' : entry.volumeInfo.infoLink;
    let author = entry.volumeInfo.authors === undefined ? 'No Author Provided' : entry.volumeInfo.authors.join(', ');
    console.log(image, keyid, published, info);
      return <div key={keyid} className="bookCard">
        <img className="image" src={image}/>
        <h3 className="title">{entry.volumeInfo.title}</h3>
        <p className="author">By: {author}</p>
        <p className="publisher">Published By: {published}</p>
        <a className="info" href={entry.volumeInfo.infoLink} target="_blank"><strong>More Info</strong></a>
      </div>;
  });
  return (
    <div className="books-wrapper">
    {bookCards}
    </div>
  );
}

// const common = ['the', 'and', 'is', 'in', 'or', 'that', 'a', 'on'];

export default BookSearch;
