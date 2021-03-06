import React, { Component } from 'react';
import './App.css';
import * as Catalog from './Catalog';
import { SingleSelectionDropdown, MultiSelectionDropdown } from './SelectionDropDown';
import { MarketplaceCardList } from './MarketplaceCardList'

function sortMarketplaceItems(items, sortKey, swapDirection) {
  // items.sort(function (a, b) {
  //   if (a[sortKey] > b[sortKey]) {
  //     return swapDirection ? 1 : -1;
  //   }
  //   else {
  //     return swapDirection ? -1 : 1;
  //   }
  // });

  return items;
}

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.submit_text(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form className="row" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="search" className="form-control col" id="catalog-search" aria-describedby="emailHelp" placeholder="Search Catalog" value={this.state.value} onChange={this.handleChange} />
          <button type="submit" className="btn btn-primary col">Submit</button>
          <small id="search-help" className="form-text text-muted col">Searches title and description.</small>
        </div>
      </form>
    )
  }
}


class PageNav extends React.Component {
  constructor(props) {
    super(props);

    // Methods
    this.setPage = this.setPage.bind(this);
    this.movePage = this.movePage.bind(this);
  }

  setPage(pageIndex) {
    this.props.select_page(pageIndex);
  }

  movePage(pageDirection) {
    this.props.select_page(this.props.current_page + pageDirection);
  }

  render() {
    let pageControls = [];

    // Previous
    pageControls.push((
      <li className={this.props.current_page === 0 ? "page-item disabled" : "page-item"} key="previous">
        <button className="page-link" tabIndex="-1" onClick={() => this.movePage(-1)}>Previous</button>
      </li>
    ));

    for(let i = 0; i < this.props.page_count; ++i) {
      let currentClass = "page-item";
      if(i === this.props.current_page) {
        currentClass = "page-item disabled";
      }

      pageControls.push((
        <li className={currentClass} key={i}><button className="page-link" onClick={() => this.setPage(i)} page_index={i}>{i + 1}</button></li>
      ));
    }

    // Next
    pageControls.push((
      <li className={this.props.current_page >= (this.props.page_count - 1) ? "page-item disabled" : "page-item"} key="next">
        <button className="page-link" tabIndex="-1" onClick={() => this.movePage(1)}>Next</button>
      </li>
    ));

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-end">
         {pageControls}
        </ul>
      </nav>
    );
  }
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
    this.refreshCatalog = this.refreshCatalog.bind(this);
    this.search = this.search.bind(this);
    this.setSearchPage = this.setSearchPage.bind(this);

    this.state = {
      unfiltered_card_data: [],
      filtered_card_data: [],
      current_sort_options: sSortOptions.creation_date,
      sort_options: sSortOptions,
      content_types: sMarketplaceItemTypes,
      current_content_types: [sMarketplaceItemTypes.world_template, sMarketplaceItemTypes.mashup, sMarketplaceItemTypes.skin_pack, sMarketplaceItemTypes.resource_pack],

      search_term: null,
      search_pending: true,
      search_per_page: 25,
      search_page: 0,
      search_page_count: 0,
      search_results_total: 0,
      search_skip: 0,
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
      this.refreshCatalog();
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
      this.refreshCatalog();
    });
  }

  setSearchPage(pageNumber) {
    this.setState((prevState) => {
      prevState.search_page = pageNumber;
      prevState.search_skip = prevState.search_per_page * prevState.search_page;

      return prevState;
    }, () => {
      this.refreshCatalog();
    });
  }

  sortMarketplaceContent(callback) {
    this.setState((prevState) => {
      let cardData = [];
      // Filter
      for (let i = 0; i < prevState.unfiltered_card_data.length; ++i) {
        let currentCardData = prevState.unfiltered_card_data[i];

        // Check if any of our tags are currently applied
        if (this.getContentType(prevState.current_content_types, currentCardData)) {
          cardData.push(currentCardData);
        }
        else {
          continue;
        }
      }

      // Then sort
      cardData = sortMarketplaceItems(cardData, prevState.current_sort_options.sort_key, prevState.current_sort_options.current_sort);

      prevState.filtered_card_data = cardData;
      prevState.search_pending = false;

      return prevState;
    }, () => { if (callback) { callback(); } });
  }

  refreshCatalog() {
    // Clear previous state and prepare to search
    this.setState((prevState) => {
      prevState.unfiltered_card_data = [];
      prevState.filtered_card_data = [];

      return prevState;
    });

    let tags = [];
    for (let i = 0; i < this.state.current_content_types.length; ++i) {
      tags.push(this.state.current_content_types[i].xforge_key);
    }

    Catalog.search(tags, this.state.search_per_page, this.state.search_skip, this.state.search_term, marketplaceData => {
      let freshMarketplaceItems = []

      const twoWeeksAgo = new Date(new Date() - 12096e5);

      let marketplaceItems = marketplaceData.results;
      for (var i = 0; i < marketplaceItems.length; i++) {
        let currentItem = marketplaceItems[i].document;

        const contentType = this.getContentType(this.state.content_types, currentItem);
        if (!contentType) {
          console.log("Trying to load xforge item with unknown content type");
          continue;
        }

        const currentCreationData = Date.parse(currentItem.creationDate);

        let label = null;
        if (currentCreationData > twoWeeksAgo) {
          label = "New!";
        }

        freshMarketplaceItems.push({
          author: currentItem.custom.creatorName,
          title: currentItem.title,
          image_url: currentItem.thumbnailUrl,
          key: currentItem.productId,
          label: label,
          average_rating: currentItem.averageRating ? currentItem.averageRating : 0,
          total_ratings: currentItem.totalRatingsCount ? currentItem.totalRatingsCount : 0,
          creation_date: currentItem.creationDate,
          offer_uri: "minecraft://openStore?showStoreOffer=" + currentItem.productId,
          tags: currentItem.tags,
          content_type: contentType
        });
      }

      // Set state then sort
      this.setState((prevState) => {
        prevState.unfiltered_card_data = freshMarketplaceItems;
        prevState.search_results_total = marketplaceData.count;
        prevState.search_page_count = Math.ceil(Number(prevState.search_results_total) / prevState.search_per_page);

        return prevState;
      }, function () {
        this.sortMarketplaceContent()
      });
    })
  }

  componentDidMount() {
    this.refreshCatalog();
  }

  search(searchTerm) {
    this.setState((prevState) => {
      prevState.search_term = searchTerm;
      prevState.search_pending = true;
      
      // Reset search stuff
      prevState.search_results_total = 0;
      prevState.search_page = 0;
      prevState.search_page_count = 0;
      prevState.search_skip = 0;

      return prevState;
    }, () => {
      this.refreshCatalog();
    });

  }

  render() {
    let marketplaceContent = null;
    let searchLabel = null;

    // Show spinner if we're currently searching
    if (this.state.search_pending) {
      marketplaceContent = <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
      searchLabel = <i>Searching Marketplace</i>
    }
    else {
      marketplaceContent = <MarketplaceCardList cards_data={this.state.filtered_card_data} />;
      searchLabel = <i>Showing results {this.state.search_skip} - {this.state.search_skip + this.state.filtered_card_data.length - 1} of {this.state.search_results_total}</i>
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src="./diamond.gif" alt="diamond!" height="50" />
          <h1 className="App-title">Welcome to Minecraft Market Place Demo</h1>
        </header>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          {/*<SingleSelectionDropdown available_options={this.state.sort_options} selected_option={this.state.current_sort_options} select_option={this.setSortOptions} label_prefix="Sort " />*/}
          <SearchBox submit_text={this.search} />
          <MultiSelectionDropdown available_options={this.state.content_types} selected_options={this.state.current_content_types} select_option={this.addContentTypeFilter} deselect_option={this.removeContentTypeFilter} label="Show Content Types" />
        </nav>
        <PageNav page_count={this.state.search_page_count} current_page={this.state.search_page} select_page={this.setSearchPage} />
        <p className="App-intro">
          {searchLabel}
        </p>
        {marketplaceContent}
      </div>
    );
  }

}

export default App;
