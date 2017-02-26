import React, { Component } from 'react'
import axios from 'axios'
import {
  Row, Col, Input, Card, Icon, Button,
  Collection, CollectionItem, Preloader
} from 'react-materialize'
import Player from 'react-audio-player'

import './App.css'

import Episode from './components/Episode'

class App extends Component {
  constructor() {
    super()
    this.state = {
      urlFeed: 'http://www.sueldo30.com/feed/podcast/',
      episodes: [],
      loadFeed: false,
      audio: null,
      errors: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleLoadFeed = this.handleLoadFeed.bind(this)
    this.handleAudio = this.handleAudio.bind(this)
  }

  render() {
    return (
      <div className='container'>
        <Row>
          <Col s={12}>
            <h1 className='App-title'>SIMPLE PODCAST (AMCO TEST)</h1>
            <p>By: <a href="https://edgarbaeza.mx/" target="_blank">Edgar Baeza</a></p>
            <p>Repository: <a href='https://github.com/eBaeza/podcast-amco-test' target='_blank'>https://github.com/eBaeza/podcast-amco-test</a></p>
          </Col>

          <Col s={12} m={5}>
            <Card title='Introduce un feed de Podcast' className='medium'>
              {/* URL feed field */}
              <Row>
                <Input s={12} label="URL Podcast"
                  onChange={this.handleChange}
                  defaultValue={this.state.urlFeed}
                >
                  <Icon>settings_input_antenna</Icon>
                </Input>

                { this.state.errors.length > 0 &&
                  <div className="red-text">
                    {this.state.errors.map((e, i) => (<p key={i}>{e}</p>))}
                  </div>
                }
              </Row>

              <Row className='right-align'>
                <Button waves='light' onClick={this.handleLoadFeed}>Obtener episodios</Button>
              </Row>

              {/* Player */}
              <Row>
                <h6>Reproduciendo ahora</h6>
                <Player src={this.state.audio} className='col s12' autoPlay/>
              </Row>
            </Card>
          </Col>

          {/* Collection of episodes of podcast */}
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
        <div className='center-align'>
          <br />
          <Preloader flashing/>
        </div>
      )
    } else {
      return (
        <Collection header='Episodios'>
          {
            this.state.episodes.map((episode, i) => (
              <CollectionItem key={i}>
                <Episode
                  title={episode.title}
                  img={episode.image ? episode.image.href: ''}
                  description={episode.description}
                  audio={episode.enclosure? episode.enclosure.url: ''}
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
    this.setState({audio: null, errors: []})

    if (!this.state.urlFeed) {
      const errors = ['Es necesaria la URL del podcast.']
      this.setState({errors})
    } else {
      // Note: To consume rss feeds I use YQL (https://developer.yahoo.com/yql/)
      // as an alternative to using a dedicated service to consume rss
      const yql = `select * from rss where url='${this.state.urlFeed}'`
      const url = `https://query.yahooapis.com/v1/public/yql?q=${encodeURI(yql)}&format=json&env=store%3A%2F%2Fdatata`

      this.setState({ loadFeed: true })

      axios.get(url)
        .then(response => {
          const results = response.data.query.results
          const episodes = results ? results.item : []
          const errors = !results
            ? ['No se econtraron resultados. Por favor introduzca un URL válida de podcast.'] : []

          this.setState({ episodes, loadFeed: false, errors })
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
