const deleteFromDatabase = (model) => {
  return async (req, res) => {
    try {
      await model.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.json({ message: "Deleted successfully!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error ocured while deleting!" });
    }
  };
};

module.exports = deleteFromDatabase;
