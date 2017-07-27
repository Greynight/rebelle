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

    this.dataSource = axios.create({
      baseURL: 'https://efounbqifq-dsn.algolia.net/1/indexes/Product_v2_en/'
    });
  }

  debouncedSearch = debounce((props) => {
    this.search(props);
  }, DELAY);

  search = (keyword) => {
    // if there is active request - cancel it
    if (this.cancel) {
      this.cancel();
      this.cancel = false;
    }

    // if search field is empty, clear data
    if (!keyword) {
      this.setState({
        data: []
      });

      return false;
    }

    const url = 'query?x-algolia-application-id=EFOUNBQIFQ&x-algolia-api-key=2a92fd7cd4aca67298fbe1115fdef211';
    const params = JSON.stringify({"params": `query=${keyword}`});

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const config = {
      cancelToken: source.token
    };

    this.cancel = source.cancel;

    this.dataSource.post(url, params, config).then(res => {
      // TODO slice(0, 5) was used because of problems with query limitation
      this.setState({
        data: [...res.data.hits.slice(0, 5)]
      });
    }).catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        console.error(err);
      }
    }).then(() => {
      this.cancel = false;
    });
  };

  handleSearchInputChange = (e) => {
    const keyword = e.target.value;
    this.debouncedSearch(keyword);
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
