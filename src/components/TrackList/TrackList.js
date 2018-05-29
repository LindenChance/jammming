import React from 'react';
import Track from '../Track/Track.js';
import './TrackList.css';

class TrackList extends React.Component
{
  render()
  {
    if(Array.isArray(this.props.tracks))
    {

      return (
        <div className="TrackList">
        {

          this.props.tracks.map(track => {
            return <Track onRemove={this.props.onRemove} track={track} key={track.id} onAdd={this.props.onAdd} isRemoval={this.props.isRemoval} />
          })

        }
        </div>
      );
    }
    return   <div className="TrackList"></div>
  }
}

export default TrackList;
