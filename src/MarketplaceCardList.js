import React from 'react';
import './App.css';
import * as Moment from 'moment';

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

  let labelControl = null;
  if(props.label) {
    labelControl = <span className="badge badge-pill badge-danger">{props.label}</span>
  }

  return (
    <div className="col-sm-12 col-md-4 col-lg-3">
      <div className="pad-15">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">{props.title} {labelControl}</h4>
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

export function MarketplaceCardList(props) {
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
