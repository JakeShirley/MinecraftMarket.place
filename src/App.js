import React, { Component } from 'react';
import './App.css';
import * as Catalog from './Catalog'
import * as Moment from 'moment'

function sortMarketplaceItems(items, sortKey) {
  items.sort(function (a, b) {
    if (a[sortKey] > b[sortKey]) {
      return -1;
    }
    else {
      return 1;
    }
  });

  return items;
}

const MarketplaceCard = (props) => {
  // Generate stars controls
  let stars = []
  for (let i = 0; i < 5; ++i) {
    let starDiv = null;
    if (i < Math.round(Number(props.average_rating))) {
      starDiv = <div className="glyphicon glyphicon-star" key={i} />;
    }
    else {
      starDiv = <div className="glyphicon glyphicon-star-empty" key={i} />;
    }
    stars.push(starDiv);
  }

  return (
    <div className="col-sm-3 col-md-2">
      <div className="thumbnail">
        <img className="card-image" width="300" src={props.image_url} alt={props.title} />
        <div>
          <h4>{props.title} {props.label}</h4>
          <div>
            <div>By {props.author}</div>
            <div>Created {Moment(props.creation_date).format('MM/DD/YYYY')}</div>
            <div>{stars} {props.average_rating} ({props.total_ratings} ratings)</div>
          </div>
          <form action={props.offer_uri}>
            <input className="btn btn-default" type="submit" value="Open in Minecraft" />
          </form>
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
    label: <span className="label label-danger">New!</span>,
    average_rating: 2.3,
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

      const twoWeeksAgo = new Date(new Date() - 12096e5);
      for (var i = 0; i < marketplaceItems.length; i++) {
        let currentItem = marketplaceItems[i].document;

        const currentCreationData = Date.parse(currentItem.creationDate);

        let labelControl = null;
        if (currentCreationData > twoWeeksAgo) {
          labelControl = <span className="label label-danger">New!</span>;
        }

        freshMarketplaceItems.push({
          author: currentItem.creatorGamertag,
          title: currentItem.title,
          image_url: currentItem.thumbnailUrl,
          key: currentItem.productId,
          label: labelControl,
          average_rating: currentItem.averageRating ? currentItem.averageRating : 0,
          total_ratings: currentItem.totalRatingsCount ? currentItem.totalRatingsCount : 0,
          creation_date: currentItem.creationDate,
          offer_uri: "minecraft://?showStoreOffer=" + currentItem.productId,
        });
      }

      freshMarketplaceItems = sortMarketplaceItems(freshMarketplaceItems, 'creation_date');

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
