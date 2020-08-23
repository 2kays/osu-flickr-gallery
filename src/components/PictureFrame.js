import React, { createRef } from 'react';
import GalleryNextButton from './buttons/GalleryNextButton.js';
import GalleryPrevButton from './buttons/GalleryPrevButton.js';
import GalleryFavButton from './buttons/GalleryFavButton.js';

import { buildImageUrl } from '../Helpers.js';
import history from '../history';

import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import './PictureFrame.css';

// The PictureFrame component stores a list of photo data from the Flickr API,
// and permits some child components to arbitrarily navigate around the gallery,
// either incrementally with next/previous buttons, or via a shared link.
//
// It also supports the favoriting of photos, which are persisted via browser
// LocalStorage over multiple sessions.

class PictureFrame extends React.Component {
    constructor(props) {
        super(props);

        // Store our API key and generate a URL for requesting Flickr's list of
        // interesting images.
        this.flickrApiKey = '0453bfd51d76f322a502985880c580b3';
        this.flickrInterestingUrl =
            `https://www.flickr.com/services/rest/?method=`
            + `flickr.interestingness.getList`
            + `&api_key=${this.flickrApiKey}&format=json&nojsoncallback=1`;

        this.state = {
            error: null,
            isLoaded: false,
            photos: [],
            idPhotoMap: {},
            currentIdx: 0,
        };

        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.isFavorited = this.isFavorited.bind(this);

        this.inputTitleRef = createRef();
        this.inputDescriptionRef = createRef();
    }

    // Determine whether a photo ID is saved in the user's LocalStorage list of
    // favorites (and return the definition if so).
    isFavorited(id) {
        const storage = window.localStorage;
        var favorites = storage.getItem("favorites");
        if (!favorites) {
            return false;
        }
        favorites = JSON.parse(favorites);

        return favorites[id];
    }

    handleGalleryChange(nextIndex) {
        this.inputTitleRef.current.value = "";
        this.inputDescriptionRef.current.value = "";

        const photoDef = this.getPhotoDef(nextIndex);

        history.push(`/${photoDef.id}`);
    }

    // Triggered by the Previous and Next buttons. Essentially,
    // increment/decrement the currentIdx, reset the inputs (they'll be refilled
    // on re-render), and dynamically set the page URL.

    handleNext() {
        const nextIndex = Math.min(this.state.currentIdx + 1, this.state.photos.length);
        this.setState({
            currentIdx: nextIndex
        });

        this.handleGalleryChange(nextIndex);
    }

    handlePrev() {
        const nextIndex = Math.max(this.state.currentIdx - 1, 0);

        this.setState({
            currentIdx: nextIndex
        });

        this.handleGalleryChange(nextIndex);
    }

    // Persist the currently viewed photo into the LocalStorage table of
    // favorites.
    saveCurrentAsFavorite() {
        const { currentIdx, photos } = this.state;
        const photoDef = photos[currentIdx];

        const storage = window.localStorage;

        var favorites = storage.getItem("favorites");

        if (!favorites) {
            favorites = {};
        } else {
            favorites = JSON.parse(favorites);
        }

        favorites[photoDef.id] = photoDef;

        storage.setItem("favorites", JSON.stringify(favorites));
    }

    // Triggered when the Favorite button is pressed. Simply saves the image as
    // a favorite, and forces an update to disable the button.
    handleFav(btn) {
        this.saveCurrentAsFavorite();

        // There's no easy way to propagate the button "disabled" attribute
        // without this.
        btn.forceUpdate();
    }

    // Triggered by changes in the Title and Description inputs. Update the
    // title and description of the image locally, and persist them to
    // LocalStorage if the image is favorited.
    onInfoChange(event) {
        const target = event.target;
        const value = event.target.value;

        const photoDef = this.getCurrentPhotoDef();

        if (target.className === "title") {
            photoDef.title = value;
        } else if (target.className === "description") {
            photoDef.description = value;
        }

        if (this.isFavorited(photoDef.id)) {
            this.saveCurrentAsFavorite();
        }
    }

    // Retrieve the photo definition that the PictureFrame should display.
    getCurrentPhotoDef() {
        const { currentIdx, photos, idPhotoMap } = this.state;
        const photoIdParam = this.props.match.params.photoId;

        // currentIdx indexes the photo list when the user uses the prev/next
        // buttons. This value becomes stale when the user accesses the page
        // from some arbitrary link (e.g. pressing back), so currentIdx has to
        // be updated accordingly.
        var newCurrentIdx = currentIdx;
        if (photoIdParam) {
            newCurrentIdx = idPhotoMap[photoIdParam].index;
        }
        if (currentIdx !== newCurrentIdx) {
            this.setState({ currentIdx: newCurrentIdx });
        }

        const photoDef = photos[newCurrentIdx];

        // If the freshly-determined photo definition is favorited, we want to
        // reuse the title and description assigned by the user.
        const favDef = this.isFavorited(photoDef.id);
        if (favDef) {
            photoDef.title = favDef.title;
            photoDef.description = favDef.description;
        }

        // Dynamically set the URL of the page to a direct link to the photo in
        // the gallery. The 'Back' functionality of the FavoriteManager can't //
        // work without this.
        if (!photoIdParam) {
            history.push(`/${photoDef.id}`);
        }

        return photoDef;
    }

    // Retrieve a photo definition from the Component state for some arbitrary
    // index.
    getPhotoDef(index) {
        const { photos } = this.state;
        const photoDef = photos[index];
        return photoDef;
    }

    buildPictureFrame() {
        // Build a Flickr URL corresponding to a hosted image, using the
        // information from the definition of the currently selected photo.
        const photoDef = this.getCurrentPhotoDef();
        const url = buildImageUrl(
            photoDef.farm, photoDef.server, photoDef.id, photoDef.secret
        );

        return (
            <div>
              <div>
                <div className="buttons">

                  {/*
                     Add the various navigation buttons: previous, add favorite,
                     manage favorites, next (and the App usage hints).
                   */}

                  <GalleryPrevButton handlePrev={this.handlePrev.bind(this)} />

                  <GalleryFavButton
                    handleFav={this.handleFav.bind(this)}
                    isDisabled={this.isFavorited.bind(this, photoDef.id)} />

                  <Link to='/favorites'>
                    <button className="manage">
                      Manage<br />Favorites
                    </button>
                  </Link>

                  <GalleryNextButton handleNext={this.handleNext.bind(this)} />
                </div>

                <div className="hint">
                  <span>Hint: type your own title and description!</span>
                  <br />
                  <span>They will save when you add a favorite.</span>
                </div>

                {/*
                   Add the Title and Description input textboxes.
                   Textbox placeholders are the previous photoDef entries.
                 */}

                <div>
                  <input type="text" className="title"
                         onChange={this.onInfoChange.bind(this)}
                         ref={this.inputTitleRef}
                         placeholder={
                             photoDef.title || "(Untitled)"
                         } />
                </div>

                <div>
                  <input type="text" className="description"
                         onChange={this.onInfoChange.bind(this)}
                         ref={this.inputDescriptionRef}
                         placeholder={
                             photoDef.description || "Description goes here.."
                         } />
                </div>
              </div>

              <hr />

              <img src={url} alt={photoDef.title} className="main-image"/>
            </div>
        );
    }

    render() {
        // Display someting appropriate until we load/error
        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading..</div>;
        }

        return this.buildPictureFrame();
    }

    // Request Flickr's currently "interesting" photos, and populate the
    // component state with the resulting information, ready for rendering.
    componentDidMount() {
        fetch(this.flickrInterestingUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    // Pull out Flickr's photo list.
                    const photos = result.photos.photo;

                    // Since photos is a an array, it's useful to have a map
                    // from the photo ID to the photo definition.
                    const idPhotoMap = {};
                    var idx = 0;
                    for (const photoDef of photos) {
                        idPhotoMap[photoDef.id] = photoDef;
                        idPhotoMap[photoDef.id].index = idx;
                        idx++;
                    }

                    // Register state with photo list and the ID mapping.
                    this.setState({
                        isLoaded: true,
                        photos: photos,
                        idPhotoMap: idPhotoMap
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }
}

export default withRouter(PictureFrame);
