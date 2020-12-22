import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      filter: ' '
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = ((galleryWidth-1) / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.galleryWidth != this.props.galleryWidth) {
      this.calcImageSize();
    }
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  onFilter = () => {
    const filterArr = ['blur', 'contrast', 'grayscale', 'invert', 'opacity'];
    const randomFilter = Math.floor(Math.random() * filterArr.length);
    this.setState({filter:filterArr[randomFilter] })
  }

  render() {
    return (
      <div
        className={`image-root ${this.state.filter}`}
        style={{
         // backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div>
          <LazyLoadImage src={this.urlFromDto(this.props.dto)} width={this.state.size} height={this.state.size} />
          <FontAwesome className="image-icon" name="clone" title="clone" onClick={() => this.props.onClone(this.props.dto)}/>
          <FontAwesome className="image-icon" name="filter" title="filter" onClick={this.onFilter}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={() => this.props.onExpand(this.props.dto)}/>
        </div>
      </div>
    );
  }
}

export default Image;
