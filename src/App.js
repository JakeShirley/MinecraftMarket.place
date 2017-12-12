import React, { Component } from 'react';
import './App.css';
import * as Catalog from './Catalog';
import * as Moment from 'moment';
import { SingleSelectionDropdown } from './SingleSelectionDropDown';

function sortMarketplaceItems(items, sortKey, swapDirection) {
  items.sort(function (a, b) {
    if (a[sortKey] > b[sortKey]) {
      return swapDirection ? 1 : -1;
    }
    else {
      return swapDirection ? -1 : 1;
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
      starDiv = <i className="fa fa-star" aria-hidden="true" key={i} />;
    }
    else {
      starDiv = <i className="fa fa-star-o" aria-hidden="true" key={i} />;
    }
    stars.push(starDiv);
  }

  return (
    <div className="col-sm-12 col-md-4 col-lg-3">
      <div className="pad-15">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">{props.title} {props.label}</h4>
          </div>
          <img className="card-img-top" width="300" src={props.image_url} alt={props.title} />
          <div className="card-block pad-15">
            <div>
              <div className="card-text">By <b>{props.author}</b></div>
              <div className="card-text">Created {Moment(props.creation_date).format('MM/DD/YYYY')}</div>
              <div>{stars} {props.average_rating} ({props.total_ratings} ratings)</div>
            </div>

            <a href={props.offer_uri} className="btn btn-primary">Open in Minecraft</a>
          </div>
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
    <div className="container">
      <div className="row no-gutters">
        {
          // Spread card data to props
          props.cards_data.map(card => <MarketplaceCard {...card} />)
        }
      </div>
    </div>
  )
}

const sSortOptions = {
  creation_date: { sort_key: 'creation_date', text: 'By Creation Date', default_sort: false },

  author: { sort_key: 'author', text: 'By Author', default_sort: true },
  title: { sort_key: 'title', text: 'By Title', default_sort: true },
  average_rating: { sort_key: 'average_rating', text: 'By Average Rating', default_sort: false },
  total_ratings: { sort_key: 'total_ratings', text: 'By Total Ratings', default_sort: false },
};

class App extends Component {
  constructor(props) {
    super(props);

    // Methods
    this.setSortOptions = this.setSortOptions.bind(this);
    this.sortMarketplaceContent = this.sortMarketplaceContent.bind(this);

    this.state = {
      card_data: sCardListData,
      current_sort_options: sSortOptions.creation_date,
      sort_options: sSortOptions,
    };

    for(var optionKey in this.state.sort_options) {
      let currentOption = this.state.sort_options[optionKey];
      currentOption.current_sort = currentOption.default_sort;
    }
  }

  setSortOptions(sort_options) {
    this.setState((prevState) => {
      // Either swap direction if we're toggling the same option or assign to the new one
      if(prevState.current_sort_options === sort_options) {
        prevState.current_sort_options.current_sort = !prevState.current_sort_options.current_sort;
      }
      else {
        prevState.current_sort_options = sort_options;
        prevState.current_sort_options.current_sort = prevState.current_sort_options.default_sort;
      }
      return prevState;
    });

    this.sortMarketplaceContent();
    this.forceUpdate();
  }

  sortMarketplaceContent() {
    this.setState((prevState) => {
      prevState.card_data = sortMarketplaceItems(prevState.card_data, prevState.current_sort_options.sort_key, prevState.current_sort_options.current_sort);
      return prevState;
    });
  }

  componentDidMount() {
    Catalog.search(marketplaceItems => {

      let freshMarketplaceItems = []

      const twoWeeksAgo = new Date(new Date() - 12096e5);
      for (var i = 0; i < marketplaceItems.length; i++) {
        let currentItem = marketplaceItems[i].document;

        const currentCreationData = Date.parse(currentItem.creationDate);

        let labelControl = null;
        if (currentCreationData > twoWeeksAgo) {
          labelControl = <span className="badge badge-pill badge-danger">New!</span>;
        }

        freshMarketplaceItems.push({
          author: currentItem.custom.creatorName,
          title: currentItem.title,
          image_url: currentItem.thumbnailUrl,
          key: currentItem.productId,
          label: labelControl,
          average_rating: currentItem.averageRating ? currentItem.averageRating : 0,
          total_ratings: currentItem.totalRatingsCount ? currentItem.totalRatingsCount : 0,
          creation_date: currentItem.creationDate,
          offer_uri: "minecraft://openStore?showStoreOffer=" + currentItem.productId,
        });
      }

      // Set state then sort
      this.setState({ card_data: freshMarketplaceItems }, () => this.sortMarketplaceContent());
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="./diamond.gif" alt="diamond!" height="50" />
          <h1 className="App-title">Welcome to Minecraft Market Place Demo</h1>
        </header>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <SingleSelectionDropdown available_options={this.state.sort_options} selected_option={this.state.current_sort_options} select_option={this.setSortOptions} label_prefix="Sort "/>
        </nav>
        <p className="App-intro">
          Don't be too impressed by this WIP.
        </p>
        <MarketplaceCardList cards_data={this.state.card_data} />
      </div>
    );
  }
}

export default App;
