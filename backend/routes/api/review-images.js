const express = require("express");

const { Review, ReviewImage } = require("../../db/models");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");

// Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const userId = req.user.id;

  const reviewImage = await ReviewImage.findByPk(imageId, {
    include: {
      model: Review,
      attributes: ["userId"],
    },
  });

  if (!reviewImage) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  }

  if (reviewImage.Review.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await reviewImage.destroy();
  res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
