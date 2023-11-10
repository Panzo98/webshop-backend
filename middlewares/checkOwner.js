const checkOwner = (model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const isOrderOwner = await model.findOne({
        where: { id: id, userId },
      });
      if (!isOrderOwner)
        return res.status(500).json({ message: "Ownership error!" });
      next();
    } catch (error) {
      return res.status(500).json({ message: "Ownership error!" });
    }
  };
};

module.exports = checkOwner;
