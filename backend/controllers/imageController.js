const checkExpiry = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const labels = ['Fresh', 'NearExpiry', 'Spoiled'];
    const mockResult = labels[Math.floor(Math.random() * labels.length)];

    return res.status(200).json({
      success: true,
      data: {
        filename: req.file.originalname,
        status: mockResult,
        confidence: Number((0.7 + Math.random() * 0.29).toFixed(2)),
        modelIntegration: {
          ready: true,
          externalModelUrl: process.env.ML_EXPIRY_URL || 'http://localhost:5002/detect'
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  checkExpiry
};
