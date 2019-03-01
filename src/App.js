import React from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import ScrollEvent from 'react-onscroll';

const URL_PATH = 'https://www.googleapis.com/books/v1/volumes';

class BookSearch extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input: '',
      search: false,
      error: false,
      items: [],
      button: false,
    };
    this.addText = this.addText.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.searchOnEnter = this.searchOnEnter.bind(this);
    this.handleScrollCallback = this.handleScrollCallback.bind(this);
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
      fetch(`${URL_PATH}?q=${search}&maxResults=21`)
        .then(response => response.json())
        .then(json => {
          let { items } = json;
          this.setState({ items });
          console.log(items);
        })
    }
  };

  searchOnEnter(e) {
    let code = e.keyCode || e.which;
    if (code === 13){
      if (this.state.input === ''){
        this.setState({error: true})
        this.setState({search: false})
      } else {
        this.setState({search: true})
        const search = this.state.input.split(" ").join('+');
        fetch(`${URL_PATH}?q=${search}&maxResults=21`)
          .then(response => response.json())
          .then(json => {
            let { items } = json;
            this.setState({ items });
            console.log(items);
        })
    }}
  };

  handleScrollCallback(e) {
    if(document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      this.setState({button: true});
    } else {
      this.setState({button: false});
    }
  }

  render () {
    const isThereInput = this.state.error;
    const validSearch = this.state.search;
    let info;
    if (isThereInput) {
      info = <SearchError onSearch={this.onSearch} />; 
    } else if (validSearch) {
      info = <Books searchOnEnter={this.searchOnEnter} onSearch={this.onSearch} items={this.state.items} />;
    } else {
      info = <NoResults />;
    }
    return (
      <div id="wrapper">
        <ScrollEvent handleScrollCallback={this.handleScrollCallback} />
        <h1>BOOK FINDER</h1>
        <Search 
          input={this.state.input}
          searchOnEnter={this.searchOnEnter} 
          onSearch={this.onSearch} 
          addText={this.addText}/>
        {info}
        <BackToTop button={this.state.button} />
      </div>
    );
  }
}

function Search(props){
  return (
    <div id="search-wrapper">
      <input type="text" id="search" placeholder="Search by book title or author" onKeyPress={props.searchOnEnter} onChange={props.addText}/>
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
  if (bookItems){
  var bookCards = bookItems.map((entry) => {
    let image = entry.volumeInfo.imageLinks === undefined ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png' : entry.volumeInfo.imageLinks.smallThumbnail;
    let keyid = entry.id === undefined ? 'No ID' : entry.id;
    let published = entry.volumeInfo.publisher === undefined ? 'No Publisher Provided' : entry.volumeInfo.publisher;
    let info = entry.volumeInfo.infoLink === undefined ? '#' : entry.volumeInfo.infoLink;
    let author = entry.volumeInfo.authors === undefined ? 'No Author Provided' : entry.volumeInfo.authors.join(', ');
      return <div key={keyid} className="bookCard">
        <img className="image" src={image}/>
        <h3 className="title">{entry.volumeInfo.title}</h3>
        <p className="author">By: {author}</p>
        <p className="publisher">Published By: {published}</p>
        <a className="info" href={entry.volumeInfo.infoLink} target="_blank"><strong>More Info</strong></a>
      </div>;
  });
  } else {
    bookCards = <div className="unsuccessful"><p>No results returned, please try again, thanks!</p></div> 
  }
  return (
    <div className="books-wrapper">
    {bookCards}
    </div>
  );
}

function BackToTop(props){
  let buttonId;
  if (props.button){
    buttonId = 'button';
  } else {
    buttonId = 'button-hide';
  };
  return (
  <a href="#wrapper" id={buttonId}>
    <FontAwesomeIcon icon={faArrowUp}/> Top
  </a>
  )
}

// const common = ['the', 'and', 'is', 'in', 'or', 'that', 'a', 'on'];

export default BookSearch;
