import React, { Component } from 'react'
import axios from 'axios'
import {
  Row, Col,
  Input,
  Icon, Button,
  Collection, CollectionItem,
  Preloader
} from 'react-materialize'

import Episode from './components/Episode'

class App extends Component {
  constructor() {
    super()
    this.state = {
      urlFeed: 'http://www.sueldo30.com/feed/podcast/',
      episodes: [],
      loadFeed: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleLoadFeed = this.handleLoadFeed.bind(this)
  }

  render() {
    return (
      <Row>
        <Col s={12}><h1>SIMPLE PODCAST (AMCO TEST)</h1></Col>

        <Col s={12} m={5}>
          <Row>
            <Input s={12} label="URL Podcast"
              onChange={this.handleChange}
              defaultValue={this.state.urlFeed}
            >
              <Icon>settings_input_antenna</Icon>
            </Input>
          </Row>
          <Row>
            <Button waves='light' onClick={this.handleLoadFeed}>Obtener episodios</Button>
          </Row>
        </Col>

        <Col s={12} m={7}>
          { this.renderEpisodes() }
        </Col>
      </Row>
    )
  }

  renderEpisodes() {
    if (this.state.loadFeed) {
      return (
        <div className='center-align'><Preloader flashing/></div>
      )
    } else {
      if (!this.state.episodes.length) return

      return (
        <Collection header='Episodios'>
          {
            this.state.episodes.map((episode, i) => (
              <CollectionItem key={i}>
                <Episode
                  title={episode.title}
                  img={episode.image.href}
                  description={episode.descriptionipion}
                  ></Episode>
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
          this.setState({ episodes, loadFeed: false })
        })
        .catch(error => {
          console.log(error)
          this.setState({ episodes: [], loadFeed: false })
        })
    }
  }
}

export default App
