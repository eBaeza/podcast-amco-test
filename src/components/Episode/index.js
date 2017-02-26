import React, { Component } from 'react'

class Episode extends Component {
  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <figure>
          <img className="responsive-img" src={this.props.img} alt={this.props.title} />
        </figure>
        <div dangerouslySetInnerHTML={{__html: this.props.description}}></div>
      </div>
    )
  }
}

export default Episode
