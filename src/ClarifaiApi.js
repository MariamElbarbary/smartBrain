import Clarifai from 'clarifai'

class ClarifaiApp {
    constructor() {
        this.app = new Clarifai.App({
            apiKey: '373b18531b924a42be1645f92ea499c7'
        });
    }

    faceDetectionApi(imgURL) {
        return (
            this.app.models.initModel({
            id: Clarifai.FACE_DETECT_MODEL,
        })
            .then(faceModel => faceModel.predict(imgURL))
            .catch(err => console.log(err))
        );
    }

}

export default new ClarifaiApp();