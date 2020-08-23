import React from 'react';

import './GalleryButtons.css';

class GalleryPrevButton extends React.Component {
    render() {
        const handlePrev = this.props.handlePrev;
        return (
            <button onClick={ () => handlePrev() }
                    className="previous">
              <i className="fa fa-arrow-left"></i>
            </button>
        );
    }
}

export default GalleryPrevButton;
