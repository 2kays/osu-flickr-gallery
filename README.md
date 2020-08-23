## OSUMC Photo Gallery (JavaScript + React + Flickr API)

UI should be fairly intuitive:

 * Use Next/Prev buttons to navigate the gallery images.
 * Press the heart icon to favorite them.
 * Manage favorites using the "Manage Favorites" button
     * Delete favorites with the cross button.
 * Change image title and description using the input boxes.

The gallery is auto-populated with images from Flickr's "interesting images"
API. These change daily. The Title field for images is autofilled with the image
title from Flickr.

Main code of interest is here:  
https://github.com/2kays/osu-flickr-gallery/tree/master/src/components

## Usage

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Screenshots

### Desktop Gallery:

![](/gallery_screenshot1.png)

### Mobile Gallery

![](/gallery_screenshot2.png)

### Favorites Manager

![](/favmanager_screenshot1.png)
