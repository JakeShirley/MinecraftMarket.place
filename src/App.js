import React, { Component } from 'react';
import './App.css';
import * as Catalog from './Catalog'
import { Button } from 'react-bootstrap';

const MarketplaceCard = (props) => {
  // Generate stars controls
  let stars = []
  for (let i = 0; i < 5; ++i) {
    if (i < props.stars) {
      var starDiv = <div className="glyphicon glyphicon-star" key={i}/>;
    }
    else {
      var starDiv = <div className="glyphicon glyphicon-star-empty" key={i}/>;
    }
    stars.push(starDiv);
  }

  return (
    <div className="col-sm-3 col-md-2">
      <div className="thumbnail">
        <img className="card-image" width="300" src={props.image_url} alt={props.title} />
        <div className="caption">
          <h3>{props.title} {props.label}</h3>
          <div>By {props.author}</div>
          <div>{stars}</div>
          <button className="btn btn-default">View</button>
        </div>
      </div>
    </div>
  )
};

let sCardListData = [
  {
    author: "Imagiverse",
    title: "Relics of the Privateers",
    image_url: "https://ugcorigin.s-microsoft.com/12/78ec6765-ceb2-4ced-b874-bb4a4dbbd576/550/profile.jpg",
    key: "G009SXM3DGGW_ModSkuId_",
    label: <span className="label label-default">New</span>
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
        let currentItem = marketplaceItems[i].document;

        freshMarketplaceItems.push({
          author: currentItem.creatorGamertag,
          title: currentItem.title,
          image_url: currentItem.thumbnailUrl,
          key: currentItem.productId,
          label: <span className="label label-default">New</span>,
          stars: currentItem.averageRating
        });
      }

      this.setState({ card_data: freshMarketplaceItems });
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="./diamond.gif" alt="diamond!" height="50" />
          <h1 className="App-title">Welcome to Minecraft Market Place Demo</h1>
        </header>
        <p className="App-intro">
          Don't be too impressed by this WIP.
        </p>
        <MarketplaceCardList cards_data={this.state.card_data} />
      </div>
    );
  }
}

export default App;
