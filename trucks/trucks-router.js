const router = require('express').Router();

const restricted = require('../auth/restricted-middleware');

const Trucks = require('./trucks-model');
const Menus = require('../menus/menus-model');
const { validTruck } = require('./trucks-service');

/* ----- GET /api/trucks ----- */
router.get('/', restricted, (req, res) => {
  Trucks.find()
    .then((trucks) => {
      res.status(200).send(trucks);
    })
    .catch((err) => {
      res.send(err);
    });
});

/* ----- GET /api/trucks/:id ----- */
router.get('/:id', restricted, (req, res) => {
  const { id } = req.params;

  Trucks.findById(id)
    .then((truck) => {
      if (truck) {
        res.status(200).json(truck);
      } else {
        res.status(404).json({ message: 'Could not find truck with given id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to get truck' });
    });
});

/* ----- POST /api/trucks ----- */
router.post('/', restricted, (req, res) => {
  const truck = req.body;

  if (validTruck(truck)) {
    Trucks.add(truck)
      .then((truck) => {
        res.status(201).json(truck);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message:
        'name, imageOfTruck, cuisineType, currentLocation, and operatorId are required to create a new truck'
    });
  }
});

/* ----- PUT /api/trucks/:id ----- */
router.put('/:id', restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  Trucks.findById(id)
    .then((truck) => {
      if (truck) {
        Trucks.update(changes, id).then((updatedTruck) => {
          res.json(updatedTruck);
        });
      } else {
        res.status(404).json({ message: 'Could not find truck with given id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to update truck' });
    });
});

/* ----- DELETE /api/trucks/:id ----- */
router.delete('/:id', restricted, (req, res) => {
  const { id } = req.params;

  Trucks.remove(id)
    .then((deleted) => {
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find truck with given id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to delete truck' });
    });
});

/* ----- GET /api/trucks/:id/menu ----- */
router.get('/:id/menu', restricted, (req, res) => {
  const { id } = req.params;

  Menus.findByTruckId(id)
    .then((menu) => {
      res.status(200).json(menu);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
