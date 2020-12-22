import React from 'react';
import './popup.scss';



class Popup extends React.Component {
    constructor(props){
        super(props)
    }

    urlFromDto = (dto)=> {
        return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
      }

    render(){
        return (
           <div
              className="mask"
              onClick={()=> this.props.close(null)}
              >
              <div className="extendImg" style={{
                backgroundImage: `url(${this.urlFromDto(this.props.cDto)})`
              }}/>
               
            </div>
          );
    }
}

export default Popup;