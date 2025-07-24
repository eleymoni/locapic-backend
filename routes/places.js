var express = require('express');
var router = express.Router();

require('../models/connection');
const Place = require('../models/places');

function checkBody(body, keys) {
    let isValid = true;
  
    for (const field of keys) {
      if (!body[field] || body[field] === '') {
        isValid = false;
      }
    }
  
    return isValid;
  }

router.post('/', (req, res) => {
    if (!checkBody(req.body, ['nickname', 'name', 'latitude', 'longitude'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
    const newPlace = new Place({
        nickname: req.body.nickname,
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      });
    
      newPlace.save()
        .then(() => {
          res.json({ result: true });
        })
        .catch((err) => {
          console.error(err);
          res.json({ result: false, error: 'error saving new place' });
        });
    });
  
router.get('/:nickname', (req, res) => {
   Place.find({ nickname: req.params.nickname }).then(data => {
      if (data) {
        res.json({ result: true, places: data });
      } else {
        res.json({ result: false, error: 'Nickname not found' });
      }
    });
});

router.delete('/', (req, res) => {
    if (!checkBody(req.body, ['nickname', 'name'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }
    Place.deleteOne({nickname: req.body.nickname, name: req.body.name})
    .then((data) => {
        res.json({result: true})
    })
    .catch((err) => {
        console.error(err);
        res.json({result: false, error: 'error deleting place'})
    })
})
  
  module.exports = router;