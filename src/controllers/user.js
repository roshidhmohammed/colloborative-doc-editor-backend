export const profile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "successfully fetched user info",
      data: req.user,
    });
  } catch (error) {
    return next(error);
  }
};
