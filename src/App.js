import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as Catalog from './Catalog'
import { Button } from 'react-bootstrap';

const MarketplaceCard = (props) => {
  return (
    <div className="card">
      <img width="300" src={props.image_url} alt={props.title} />
      <div className="card-info">
        <div className="card-info-title">{props.title}</div>
        <div>{props.author}</div>
        <button className="btn btn-default">TestButton</button>
      </div>
    </div>
  )
};

let sCardListData = [
  {
    author: "Imagiverse",
    title: "Relics of the Privateers",
    image_url: "https://ugcorigin.s-microsoft.com/12/78ec6765-ceb2-4ced-b874-bb4a4dbbd576/550/profile.jpg",
    key: "G009SXM3DGGW_ModSkuId_"
  }
]

const MarketplaceCardList = (props) => {
  return (
    <div>
      {
        // Spread card data to props
        props.cards_data.map(card => <MarketplaceCard {...card} />)
      }
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      card_data: sCardListData
    };
  }

  componentDidMount() {
    // axios.get(`http://www.reddit.com/r/teslamoters.json`)
    //   .then(res => {
    //     const posts = res.data.data.children.map(obj => obj.data);
    //     this.setState({ posts });
    //   });
    Catalog.search(marketplaceItems => {

      let freshMarketplaceItems = []

      for (var i = 0; i < marketplaceItems.length; i++) {
        let currentItem = marketplaceItems[i];

        freshMarketplaceItems.push({
          author: currentItem.document.creatorGamertag,
          title: currentItem.document.title,
          image_url: currentItem.document.thumbnailUrl,
          key: currentItem.document.productId
        });
      }

      this.setState({ card_data: freshMarketplaceItems });
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Minecraft Market Place Demo</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <MarketplaceCardList cards_data={this.state.card_data} />
      </div>
    );
  }
}

export default App;
