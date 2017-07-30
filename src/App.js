import React, { Component } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import {ResultItem} from './components/ResultItem';

const DELAY = 100;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.cancel = false;
    this.keyword = false;

    this.dataSource = axios.create({
      baseURL: 'https://efounbqifq-dsn.algolia.net/1/indexes/Product_v2_en/'
    });
  }

  debouncedSearch = debounce(() => {
    this.search();
  }, DELAY);

  search = () => {
    // if there is active request - cancel it
    if (this.cancel) {
      this.cancel();
      this.cancel = false;

      return false;
    }

    // if search field is empty, clear data
    if (!this.keyword) {
      this.setState({
        data: []
      });

      return false;
    }

    this.sendSearchRequest().then(res => {
      this.setState({
        data: [...res.data.hits]
      });
    }).catch((err) => {
      if (axios.isCancel(err)) {
        this.debouncedSearch();
      } else {
        console.error(err);
      }
    }).then(() => {
      this.cancel = false;
    });
  };

  sendSearchRequest = () => {
      const url = 'query?x-algolia-application-id=EFOUNBQIFQ&x-algolia-api-key=2a92fd7cd4aca67298fbe1115fdef211';
      // TODO api doesn't accept 'limit' parameter
      const params = JSON.stringify({"params": `query=${this.keyword}&hitsPerPage=5`});
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      const config = {
          cancelToken: source.token
      };

      this.cancel = source.cancel;

      return this.dataSource.post(url, params, config);
  };

  handleSearchInputChange = (e) => {
    this.keyword = e.target.value;
    this.debouncedSearch();
  };

  render() {
    return (
      <div className="app">
        <div
          className="search-input"
          onChange={this.handleSearchInputChange}
        >
          <input type="text" />
        </div>
        <div className="search-results">
          {this.state.data.map(item => <ResultItem
            key={item.id}
            title={item.title}
            brand={item.brand}
            images={item.images}
          />)}
        </div>
      </div>
    );
  }
}

export default App;
