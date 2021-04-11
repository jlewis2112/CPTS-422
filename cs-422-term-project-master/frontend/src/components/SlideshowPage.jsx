import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

// I import the component Slide here

// Components are just classes! 
export default class SlideshowPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      images: [
        '/images/Image1.jpg',
        '/images/Image2.jpg',
        '/images/Image3.jpg',
        '/images/Image4.jpg',
      ],
    }
  }

  // What do when I get unmounted
  componentWillUnmount() {
    //this.abortController.abort();
  }

  // Called when I am drawn as html
  render() {
    let slides = [];
    // https://tailwindcss.com/

    // for of only works on iterables, can do for (const thing of Object.entries(some_object)) {} on objects...
    for (const image of this.state.images) {
      slides.push(
        <div className="each-slide" key={image}>
          <center>
            <img width="720" src={image}></img>
          </center>
        </div>
      )
    }

    return (
      <div>
        <p className = "welcomeText">Welcome to Horizon Sunset Apartments!</p>
      <div className="slide-container" id="slides">
        <Slide>
        {slides}
        </Slide>
      </div>
      </div>
    );
  }
}