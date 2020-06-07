const { faceDetectionApi,
    calculateFaceLocation } = require('./ClarifaiApi')

const handleImage = (req, res, db) => {
    const { id, img } = req.body;

    faceDetectionApi(img)
        .then(boxBorders => {
            db('users')
                .where({ id })
                .increment('entries', 1)
                .returning('entries')
                .then(entries => {
                    res.status(200).json({
                        'count': entries[0],
                        'box': boxBorders
                    })
                })
                .catch(err => res.status(500).json('something went wrong in db insertion'));

        })
        .catch(err => res.status(500).json('something went wrong in face detection'));

}

module.exports = {
    handleImage: handleImage
};