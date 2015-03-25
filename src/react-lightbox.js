var React = require('react');
var DOM = React.DOM;

var Carousel = React.createFactory(React.createClass({
  getInitialState: function () {
    return {
      previous: null,
      current: this.props.current
    };
  },
  componentWillMount: function () {
    if (this.props.keyboard) {
      window.addEventListener('keydown', this.changePictureByKeyboard);
    }
  },
  componentWillUnmount: function () {
    if (this.props.keyboard) {
      window.removeEventListener('keydown', this.changePictureByKeyboard);
    }
  },
  changePictureByKeyboard: function (event) {
    if (event.keyCode === 37) {
      this.backward();
    }
    if (event.keyCode === 39) {
      this.forward();
    }
  },
  getNextIndex: function () {
    return this.props.pictures.length === this.state.current + 1 ? 0 : this.state.current + 1;
  },
  getPreviousIndex: function () {
    return this.state.current === 0 ? this.props.pictures.length - 1 : this.state.current - 1;
  },
  forward: function () {
    this.setState({
      previous: this.state.current,
      current: this.getNextIndex()
    });
  },
  backward: function () {
    this.setState({
      previous: this.state.current,
      current: this.getPreviousIndex()
    });
  },
  isForwarding: function () {
    return this.state.previous === this.getPreviousIndex();
  },
  createInitialPictureClass: function (index) {
    var className = 'react-lightbox-carousel-image';
    if (index === this.getPreviousIndex()) {
      return className;
    }
    if (index === this.state.current) {
      return className += ' react-lightbox-carousel-image-in';
    }
    if (index === this.getNextIndex()) {
      return className += ' react-lightbox-carousel-image-out';  
    }
  },
  createPictureClass: function (index) {
    var className = 'react-lightbox-carousel-image';

    // Set correct classes based on current index
    if (this.state.previous === null) {
      return this.createInitialPictureClass(index);
    }

    // Normal forward behavior
    if (index === this.state.previous && !this.isForwarding()) {
      return className += ' react-lightbox-carousel-image-out';
    }
    if (index === this.state.current) {
      return className += ' react-lightbox-carousel-image-in';
    }

    // Reverse with backward behavior
    if (index === this.state.previous && this.isForwarding()) {
      return className;
    }
    if (this.isForwarding()) {
      return className += ' react-lightbox-carousel-image-out';
    }

    return className;
  },
  renderPictures: function () {
    return this.props.pictures.map(function (picture, index) {
      return DOM.div({
        className: this.createPictureClass(index),
        style: {
          backgroundImage: 'url(' + picture + ')',
          visibility: this.state.previous === index || this.state.current === index ? 'visible' : 'hidden' 
        }
      });
    }, this);
  },
  renderControls: function () {
    if (this.props.controls) {
      return React.createFactory(this.props.controls)({
        backward: this.backward,
        forward: this.forward
      });
    }
  },
  render: function () {
    return DOM.div({
      className: 'react-lightbox-carousel',
    }, this.renderPictures(), this.renderControls());
  }
}));

var Lightbox = React.createClass({
  componentDidMount: function () {
    this.overlay = document.createElement('div');
    this.overlay.className = 'react-lightbox-overlay';
  },
  componentWillUnmount: function () {

  },
  openLightbox: function (index) {
    this.overlay.innerHMTL = '';
    this.overlay.className = 'react-lightbox-overlay';
    document.body.appendChild(this.overlay);
    React.render(Carousel({
      pictures: this.props.pictures,
      current: index,
      keyboard: this.props.keyboard,
      controls: this.props.controls
    }), this.overlay);
    requestAnimationFrame(function () {
      this.overlay.classList.add('react-lightbox-overlay-open');
    }.bind(this));
  },
  closeLightbox: function () {

  },
  renderPictures: function (pictureUrl, index) {
    return DOM.div({
      className: 'react-lightbox-image',
      onClick: this.openLightbox.bind(this, index),
      style: {
        backgroundImage: 'url(' + pictureUrl + ')'
      }
    });
  },
  render: function () {
    return DOM.div({
      className: 'react-lightbox'
    }, (this.props.pictures || []).map(this.renderPictures));
  }
})


module.exports = Lightbox;
