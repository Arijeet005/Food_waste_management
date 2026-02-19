const Ngo = require('../models/Ngo');

const createNgo = async (req, res, next) => {
  try {
    const ngo = await Ngo.create(req.body);
    return res.status(201).json({ success: true, data: ngo });
  } catch (error) {
    return next(error);
  }
};

const getNgos = async (req, res, next) => {
  try {
    const { kitchenId } = req.query;
    const filter = kitchenId ? { kitchenId } : {};
    const ngos = await Ngo.find(filter).sort({ name: 1 });
    return res.status(200).json({ success: true, data: ngos });
  } catch (error) {
    return next(error);
  }
};

const getNearbyNgos = async (req, res, next) => {
  try {
    const {
      lat,
      lng,
      radiusKm = 10,
      kitchenId
    } = req.query;

    const distanceMeters = Number(radiusKm) * 1000;
    const nearQuery = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: distanceMeters
        }
      }
    };

    if (kitchenId) {
      nearQuery.kitchenId = kitchenId;
    }

    const ngos = await Ngo.find(nearQuery).limit(50);

    const withDistance = ngos.map((ngo) => {
      const [ngoLng, ngoLat] = ngo.location.coordinates;
      const toRadians = (value) => (value * Math.PI) / 180;
      const earthKm = 6371;
      const dLat = toRadians(ngoLat - Number(lat));
      const dLng = toRadians(ngoLng - Number(lng));
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(Number(lat))) *
          Math.cos(toRadians(ngoLat)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = Number((earthKm * c).toFixed(2));

      return {
        ...ngo.toObject(),
        distanceKm
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        source: { lat: Number(lat), lng: Number(lng), radiusKm: Number(radiusKm) },
        count: withDistance.length,
        ngos: withDistance
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createNgo,
  getNgos,
  getNearbyNgos
};
