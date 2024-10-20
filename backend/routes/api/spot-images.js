const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');
const { Spot } = require('../../db/models');

const router = express.Router();

// delete a spot image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;
  
    try {
      const spotImage = await SpotImage.findByPk(imageId, {
        include: {
          model: Spot,
          attributes: ['ownerId']
        }
      });
  
      if (!spotImage) {
        return res.status(404).json({ message: "Spot Image couldn't be found" });
      }
  
      if (spotImage.Spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      await spotImage.destroy();
  
      res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  module.exports = router;