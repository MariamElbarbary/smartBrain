import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import { ROUTE } from './route'

const app = new Clarifai.App({
  apiKey: '373b18531b924a42be1645f92ea499c7'
});

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      desnity: {
        enable: true,
        value_area: 800

      }
    }
  }
}
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
    console.log(box);
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    app.models.initModel({
      id: Clarifai.FACE_DETECT_MODEL,
    }).then(faceModel => faceModel.predict(this.state.input))
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {
          this.state.route === ROUTE.home ?
            <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
            </div> : (this.state.route === ROUTE.signin ?
              <Signin onRouteChange={this.onRouteChange} /> :
              <Register onRouteChange={this.onRouteChange} />

            )
        }
      </div>
    );
  }
}

export default App;
