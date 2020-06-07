const Clarifai = require('clarifai')

const app = new Clarifai.App({
    apiKey: '373b18531b924a42be1645f92ea499c7'
});

module.exports = {
    faceDetectionApi(imgURL) {
        return (
            app.models.initModel({
                id: Clarifai.FACE_DETECT_MODEL,
            })
                .then(faceModel => faceModel.predict(imgURL))
                .catch(err => console.log(err))
        );
    },
}