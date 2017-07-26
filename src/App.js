import React, { Component } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.dataSource = axios.create({
      baseURL: 'https://efounbqifq-dsn.algolia.net/1/indexes/Product_v2_en/'
    });
  }

  // loader
  // check input value
  componentDidMount() {
    // curl 'https://efounbqifq-dsn.algolia.net/1/indexes/Product_v2_en?query=bag&limit=5’
    // -H 'X-Algolia-API-Key: 2a92fd7cd4aca67298fbe1115fdef211’ -H 'X-Algolia-Application-Id: EFOUNBQIFQ’


  }

  debouncedSearch = debounce((props) => {
    console.log('debounce: ', props);
    this.search(props);
  }, 1000);

  search = (keyword) => {
    const url = 'query?x-algolia-application-id=EFOUNBQIFQ&x-algolia-api-key=2a92fd7cd4aca67298fbe1115fdef211';
    const params = JSON.stringify({"params": `query=${keyword}`});

    this.dataSource.post(url, params).then(res => {
      this.setState({
        data: res.data.hits
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  handleSearchInputChange = (e) => {
    const keyword = e.target.value;
    this.debouncedSearch(keyword);
  };

  render() {
    return (
      <div className="App">
        <div
          className="search-input"
          onChange={this.handleSearchInputChange}
        >
          <input type="text" />
        </div>
        <p className="App-intro">
          results
        </p>
      </div>
    );
  }
}

export default App;
