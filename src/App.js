import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import { ROUTE, PARTICLESOPTIONS, INITIALSTATE } from './constants'


class App extends Component {
  constructor() {
    super();
    this.state = INITIALSTATE;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        entries: data.entries,
        joined: data.joined,
      }
    });
  }
  calculateFaceLocation = (data) =>  {
    const clarifaiFace = data['outputs'][0]['data']['regions'][0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width)
    const height = Number(image.height)

    console.log('return', height)
    return {
      leftCol: clarifaiFace.left_col * width,
      rightCol: width - (clarifaiFace.right_col * width),
      topRow: clarifaiFace.top_row * height,
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }
  onRouteChange = (routeConfig) => {
    if (routeConfig === ROUTE.signout) {
      this.setState(INITIALSTATE);
    }
    else if (routeConfig === ROUTE.home) {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: routeConfig });
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    fetch('http://localhost:3000/image', {
      method: 'put',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.state.user.id,
        img: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        this.setState(Object.assign(this.state.user, { entries: response.count }))
        this.displayFaceBox(this.calculateFaceLocation(response.box))
      })
      .catch(err => console.log(err))
  }

  renderRoute = () => {
    switch (this.state.route) {
      case ROUTE.home:
        return (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
          </div>
        );
      case ROUTE.register:
        return <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      default:
        return <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
    }
  }
  render() {
    return (
      <div className="App">
        <Particles className="particles" params={PARTICLESOPTIONS} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {this.renderRoute()}
      </div>
    );
  }
}

export default App;
