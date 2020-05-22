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
import { ROUTE, PARTICLESOPTIONS } from './constants'
import ClarifaiApp from './ClarifaiApi'


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: ROUTE.signin,
      isSignedIn: false,
    }
  }
  calculateFaceLocation = (data) => {
    const clarifaiFace = data['outputs'][0]['data']['regions'][0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width)
    const height = Number(image.height)

    return {
      leftCol: clarifaiFace.left_col * width,
      rightCol: width - (clarifaiFace.right_col * width),
      topRow: clarifaiFace.top_row * height,
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }
  onRouteChange = (routeConfig) => {
    if (routeConfig === ROUTE.signout) {
      this.setState({ isSignedIn: false });
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

    ClarifaiApp.faceDetectionApi(this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }

  homePage = () => {
    return (<div>
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={this.onInputChange}
        onButtonSubmit={this.onButtonSubmit} />
      <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
    </div>);
  }

  renderRoute = () => {
    switch (this.state.route) {
      case ROUTE.home:
        return this.homePage();
      case ROUTE.register:
        return <Register onRouteChange={this.onRouteChange} />
      default:
        return <Signin onRouteChange={this.onRouteChange} />
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
