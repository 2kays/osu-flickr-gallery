import React from 'react';

import { Link, withRouter } from 'react-router-dom';
import { buildImageUrl } from '../Helpers.js';
import history from '../history';

import './FavoriteManager.css';

// The FavoriteManager is a UI for the management of user-defined photo favorites
// created via the PictureFrame component.
//
// Favorites are stored in LocalStorage, allowing the changes here to
// immediately reflect in the PictureFrame component.

class FavoriteManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {}
        };

        this.storage = window.localStorage;
    }

    // Deletes a favorite photo, by ID, from LocalStorage.
    deleteFav(id) {
        var favorites = this.storage.getItem("favorites");
        if (!favorites) {
            return;
        }
        favorites = JSON.parse(favorites);

        delete favorites[id];

        this.storage.setItem("favorites", JSON.stringify(favorites));

        this.setState({ items: favorites });
    }

    // Populates the component state with a list of favorites, to keep
    // LocalStorage and component state synchronised.
    componentDidMount() {
        var favorites = this.storage.getItem("favorites");
        if (!favorites) {
            favorites = {};
        } else {
            favorites = JSON.parse(favorites);
        }
        this.setState({ items: favorites });
    }

    render() {
        const items = [];
        const favorites = this.state.items;
        for (const key in favorites) {
            // For every favorite in our state, build a URL for displaying the
            // photo via the <img> tag.

            const favorite = favorites[key];

            const url = buildImageUrl(
                favorite.farm, favorite.server, favorite.id, favorite.secret
            );

            // Then, build a flexbox UI of "panels" that contain the favorited
            // photo's title, description, the <img>, and a deletion button.
            //
            // The CSS is pretty heavy here, but the result is a tiled
            // image-management solution that displays well regardless of the
            // screen size of the user.

            items.push(
                <div key={favorite.id} className="flex-cell">
                  <div className="flex-item">
                    <div className="fav-header">
                      <h2>{favorite.title}</h2>

                      <button className="delete-fav"
                              onClick={this.deleteFav.bind(
                                  this, favorite.id
                              )}>
                        <i className="fa fa-times-circle"></i>
                      </button>
                    </div>

                    <div>
                      <img src={url} alt={favorite.title} className="grid-image"/>
                    </div>

                    <div>
                      <p>{favorite.description}</p>
                    </div>
                  </div>
                </div>
            );
        }

        return (
            <div className="favorite-manager">
              <h1>Manage Favorites</h1>

              {/* Add a button to take us back to the PictureFrame UI. */}

              <Link to='/'>
                <button className="go-back"
                        onClick={history.goBack}>
                  <i className="fa fa-arrow-circle-left"></i> Back
                </button>
              </Link>

              <hr />

              {/*
                 Add our parent flexbox container, and splice in the array of
                 favorited-image panel UIs.
               */}

              <div className="flex-container">
                {items}
              </div>
            </div>
        );
    }
}

export default withRouter(FavoriteManager);
