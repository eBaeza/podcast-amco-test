import React, { Component } from 'react'
import axios from 'axios'
import {
  Row, Col, Input, Card, Icon, Button,
  Collection, CollectionItem, Preloader
} from 'react-materialize'
import Player from 'react-audio-player'

import Episode from './components/Episode'

class App extends Component {
  constructor() {
    super()
    this.state = {
      urlFeed: 'http://www.sueldo30.com/feed/podcast/',
      episodes: [],
      loadFeed: false,
      audio: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleLoadFeed = this.handleLoadFeed.bind(this)
    this.handleAudio = this.handleAudio.bind(this)
  }

  render() {
    return (
      <div className='container'>
        <Row>
          <Col s={12}><h1>SIMPLE PODCAST (AMCO TEST)</h1></Col>

          <Col s={12} m={5}>
            <Card title='Introduce un feed de Podcast' className='medium'>
              <Row>
                <Input s={12} label="URL Podcast"
                  onChange={this.handleChange}
                  defaultValue={this.state.urlFeed}
                >
                  <Icon>settings_input_antenna</Icon>
                </Input>
              </Row>

              <Row className='right-align'>
                <Button waves='light' onClick={this.handleLoadFeed}>Obtener episodios</Button>
              </Row>

              <Row>
                <h6>Reproduciendo ahora</h6>
                <Player src={this.state.audio} className='col s12' autoPlay/>
              </Row>
            </Card>
          </Col>

          <Col s={12} m={7}>
            { this.renderEpisodes() }
          </Col>
        </Row>
      </div>
    )
  }

  renderEpisodes() {
    if (this.state.loadFeed) {
      return (
        <div className='center-align'><Preloader flashing/></div>
      )
    } else {
      return (
        <Collection header='Episodios'>
          {
            this.state.episodes.map((episode, i) => (
              <CollectionItem key={i}>
                <Episode
                  title={episode.title}
                  img={episode.image.href}
                  description={episode.description}
                  audio={episode.enclosure.url}
                  onPlay={this.handleAudio}
                />
              </CollectionItem>
              ))
            }
          </Collection>
        )
      }
    }

  handleChange(e) {
    this.setState({urlFeed: e.target.value})
  }

  handleLoadFeed() {
    if (!this.state.urlFeed) {
      console.log('No hay url')
    } else {
      // Note: To consume rss feeds I use YQL (https://developer.yahoo.com/yql/)
      // as an alternative to using a dedicated service to consume rss
      const yql = `select * from rss where url='${this.state.urlFeed}'`
      const url = `https://query.yahooapis.com/v1/public/yql?q=${encodeURI(yql)}&format=json&env=store%3A%2F%2Fdatata`

      this.setState({ loadFeed: true })

      axios.get(url)
        .then(response => {
          const episodes = response.data.query.results.item
          console.log(episodes)
          this.setState({ episodes, loadFeed: false })
        })
        .catch(error => {
          console.log(error)
          this.setState({ episodes: [], loadFeed: false })
        })
    }
  }

  handleAudio(audio) {
    this.setState({ audio })
  }
}

export default App
