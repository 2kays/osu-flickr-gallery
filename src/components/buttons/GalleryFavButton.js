import React from 'react';

import './GalleryButtons.css';

class GalleryFavButton extends React.Component {

    render() {
        const handleFav = this.props.handleFav;
        const isDisabled = this.props.isDisabled;
        return (
            <button onClick={ () => handleFav(this) }
                    disabled={ isDisabled() }
                    className="favorite">
              <i className="fa fa-heart"></i>
            </button>
        );
    }
}

export default GalleryFavButton;
