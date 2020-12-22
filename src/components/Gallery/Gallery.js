import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import Popup from '../popup/popup'
import './Gallery.scss';
import cloneDeep from 'lodash/cloneDeep';

const WAIT = 500;

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    index: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.debounceTimer;
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      cImage: null ,
      page: 1    
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag, needToLoad) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&text=${tag}&per_page=100&page=${this.state.page}&format=json&safe_search=1&nojsoncallback=1&sort=relevance`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET',
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) 
        {
        if(!needToLoad){
          this.setState({images: res.photos.photo});
        }
        else{
          this.setState({images: this.state.images.concat(res.photos.photo)});
        }
      }
      });
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleInfLoad);
    this.getImages(this.props.tag, false);
    this.setState({
      galleryWidth: document.body.clientWidth-20
    });
  }

  componentWillReceiveProps(props) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() =>this.getImages(props.tag, false), WAIT);
  }
 
  handleClone = (dto, index) => {
    let cpyimg = cloneDeep(dto);
    this.setState(this.state.images.splice(index,0,cpyimg));
  }

  handleResize = (e) => {
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  };

  handleInfLoad =()=>{
    let needToAdd = document.body.clientHeight-15 <= window.scrollY + window.innerHeight;
    if (needToAdd){
      this.setState({
        page: this.state.page + 1
      });
      this.getImages(this.props.tag, true);
    }
  }
  
  setExtendImage = (data)=>{
    this.setState({cImage : data})
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto, index) => {
         return <Image key={'image-' + dto.id + index} dto={dto}  index= {index} galleryWidth={this.state.galleryWidth} 
          onClone={() =>this.handleClone(dto, index)}
          onExpand={this.setExtendImage}
          />;

        })}
        {this.state.cImage && <Popup cDto={this.state.cImage} close={this.setExtendImage}/>}
      </div>
    );
  }
}

export default Gallery;
