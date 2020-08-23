import React from 'react';

import './GalleryButtons.css';

class GalleryNextButton extends React.Component {
    render() {
        const handleNext = this.props.handleNext;
        return (
            <button onClick={ () => handleNext() }
                    className="next">
              <i className="fa fa-arrow-right"></i>
            </button>
        );
    }
}

export default GalleryNextButton;
