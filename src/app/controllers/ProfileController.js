class ProfileController {
  profile(req, res, next) {
    res.render("profile", {
      title: "Profile User",
    });
  }
}
module.exports = new ProfileController();
