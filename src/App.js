import React, { Component } from 'react';
import './App.css';
import * as Catalog from './Catalog';
import * as Moment from 'moment';
import { SingleSelectionDropdown, MultiSelectionDropdown } from './SelectionDropDown';

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
  let starsControl = [];
  for (let i = 0; i < 5; ++i) {
    let starDiv = null;
    if (i < Math.round(Number(props.average_rating))) {
      starDiv = <i className="fa fa-star" aria-hidden="true" key={i} />;
    }
    else {
      starDiv = <i className="fa fa-star-o" aria-hidden="true" key={i} />;
    }
    starsControl.push(starDiv);
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
              <span className="badge badge-success"><b>{props.content_type.text}</b></span>
              <div className="card-text">Created {Moment(props.creation_date).format('MM/DD/YYYY')}</div>
              <div>{starsControl} {props.average_rating} ({props.total_ratings} ratings)</div>
            </div>

            <a href={props.offer_uri} className="btn btn-primary">Open in Minecraft</a>
          </div>
        </div>
      </div>
    </div>
  )
};

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

const sMarketplaceItemTypes = {
  realms: { xforge_key: 'realms', text: 'Realms' },
  world_template: { xforge_key: 'worldtemplate', text: 'World Template' },
  mashup: { xforge_key: 'mashup', text: 'Mash-up' },
  skin_pack: { xforge_key: 'skinpack', text: 'Skin Pack' },
  resource_pack: { xforge_key: 'resourcepack', text: 'Resource Pack' },
};

class App extends Component {
  constructor(props) {
    super(props);

    // Methods
    this.setSortOptions = this.setSortOptions.bind(this);
    this.sortMarketplaceContent = this.sortMarketplaceContent.bind(this);
    this.addContentTypeFilter = this.addContentTypeFilter.bind(this);
    this.removeContentTypeFilter = this.removeContentTypeFilter.bind(this);
    this.getContentType = this.getContentType.bind(this);

    this.state = {
      unfiltered_card_data: [],
      filtered_card_data: [],
      current_sort_options: sSortOptions.creation_date,
      sort_options: sSortOptions,
      content_types: sMarketplaceItemTypes,
      current_content_types: [sMarketplaceItemTypes.world_template, sMarketplaceItemTypes.mashup, sMarketplaceItemTypes.skin_pack, sMarketplaceItemTypes.resource_pack],
    };

    for (var optionKey in this.state.sort_options) {
      let currentOption = this.state.sort_options[optionKey];
      currentOption.current_sort = currentOption.default_sort;
    }
  }

  getContentType(contentTypes, xforgeEntry) {
     // Check if any of our tags are currently applied
     for (let tagIndex = 0; tagIndex < xforgeEntry.tags.length; ++tagIndex) {
      for (var filterIndex in contentTypes) {
        // Found a tag that is currently applied
        if (xforgeEntry.tags[tagIndex] === contentTypes[filterIndex].xforge_key) {
         return contentTypes[filterIndex];
        }
      }
    }

    return null;
  }

  setSortOptions(sort_options) {
    this.setState((prevState) => {
      // Either swap direction if we're toggling the same option or assign to the new one
      if (prevState.current_sort_options === sort_options) {
        prevState.current_sort_options.current_sort = !prevState.current_sort_options.current_sort;
      }
      else {
        prevState.current_sort_options = sort_options;
        prevState.current_sort_options.current_sort = prevState.current_sort_options.default_sort;
      }
      return prevState;
    }, () => {
      this.sortMarketplaceContent(() => {
        this.forceUpdate();
      });
    });
  }

  addContentTypeFilter(contentType) {
    this.setState((prevState) => {
      // Add if we're not actually in the list
      let contentIndex = prevState.current_content_types.indexOf(contentType);
      if (contentIndex > -1) {
        console.log("Trying to add content type filter that is already applied!");
      }
      else {
        prevState.current_content_types.push(contentType);
      }

      return prevState;
    }, () => {
      this.sortMarketplaceContent(() => {
        this.forceUpdate();
      });
    });
  }

  removeContentTypeFilter(contentType) {
    this.setState((prevState) => {
      // Remove if we're actually in the list
      let contentIndex = prevState.current_content_types.indexOf(contentType);
      if (contentIndex > -1) {
        prevState.current_content_types.splice(contentIndex, 1);
      }
      else {
        console.log("Trying to remove content type filter that isn't applied!");
      }

      return prevState;
    }, () => {
      this.sortMarketplaceContent(() => {
        this.forceUpdate();
      });
    });
  }

  sortMarketplaceContent(callback) {
    this.setState((prevState) => {
      let cardData = [];
      // Filter
      for (let i = 0; i < prevState.unfiltered_card_data.length; ++i) {
        let currentCardData = prevState.unfiltered_card_data[i];

        // Check if any of our tags are currently applied
        if(this.getContentType(prevState.current_content_types, currentCardData)) {
          cardData.push(currentCardData);
        }
        else {
          continue;
        }
      }

      // Then sort
      cardData = sortMarketplaceItems(cardData, prevState.current_sort_options.sort_key, prevState.current_sort_options.current_sort);

      prevState.filtered_card_data = cardData;
      return prevState;
    }, () => { if (callback) { callback(); } });
  }

  componentDidMount() {
    Catalog.search(marketplaceItems => {

      let freshMarketplaceItems = []

      const twoWeeksAgo = new Date(new Date() - 12096e5);
      for (var i = 0; i < marketplaceItems.length; i++) {
        let currentItem = marketplaceItems[i].document;

        const contentType = this.getContentType(this.state.content_types, currentItem);
        if(!contentType) {
          console.log("Trying to load xforge item with unknown content type");
          continue;
        }

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
          tags: currentItem.tags,
          content_type: contentType
        });
      }

      // Set state then sort
      this.setState({ unfiltered_card_data: freshMarketplaceItems }, () => this.sortMarketplaceContent());
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
          <SingleSelectionDropdown available_options={this.state.sort_options} selected_option={this.state.current_sort_options} select_option={this.setSortOptions} label_prefix="Sort " />
          <MultiSelectionDropdown available_options={this.state.content_types} selected_options={this.state.current_content_types} select_option={this.addContentTypeFilter} deselect_option={this.removeContentTypeFilter} label="Show Content Types" />
        </nav>
        <p className="App-intro">
          Don't be too impressed by this WIP.
        </p>
        <MarketplaceCardList cards_data={this.state.filtered_card_data} />
      </div>
    );
  }
}

export default App;
