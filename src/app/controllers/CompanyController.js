class CompanyController {
  //[GET]
  company(req, res, next) {
    res.render("company", {
      title: "Company",
      user: req.user,
    });
  }
  postjob(req, res, next) {
    res.render("postjob", {
      title: "Post a job",
      user: req.user,
    });
  }
}

module.exports = new CompanyController();
