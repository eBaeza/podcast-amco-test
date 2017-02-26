import React, { Component } from 'react'
import { Button, Icon } from 'react-materialize'
import './styles.css'

class Episode extends Component {
  render() {
    return (
      <div>
        <h2 className='Episode-title'>{this.props.title}</h2>
        <p className='right-align'>
          { this.props.audio ? (
              <Button waves='light' onClick={this.handlePlay.bind(this)}>Reproducir
                <Icon right>play_circle_filled</Icon>
              </Button>
            ) : (
              <span className="red-text">No se encontró ningún audio.</span>
            )
          }
        </p>
        { this.props.img &&
          <figure className='Episode-img right'>
            <img className="responsive-img" src={this.props.img} alt={this.props.title} />
          </figure>
        }
        <div dangerouslySetInnerHTML={{__html: this.props.description}}></div>
      </div>
    )
  }

  handlePlay() {
    this.props.onPlay(this.props.audio)
  }
}

export default Episode
