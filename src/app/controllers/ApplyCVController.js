const textract = require("textract");
const nlp = require("compromise");
const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");

class ApplyCVController {
  async apply(req, res, next) {
    textract.fromFileWithPath(req.file.path, async function (error, text) {
      console.log("đây là văn bản sau khi scan cv: " + text);
      if (error) {
        console.log(error);
        return res.status(500);
        // .send({ message: "Lỗi khi trích xuất văn bản từ tệp tài liệu." });
      } else {
        try {
          const skillsSection = text.match(/Skills\s*(.*?)\s*Other/);
          const skills = skillsSection ? skillsSection[1] : "";
          if (skills == "") {
            const companyfield = await CompanyModel.distinct("companyfield");
            const matchedFields = companyfield.filter((field) => {
              const regex = new RegExp(`\\b${field}\\b`, "i");
              return regex.test(text);
            });
            const filteredFields = matchedFields.filter(
              (field) => field.length > 0
            );
            req.session.companyfield = filteredFields;
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
            res.redirect("/job/scan");
          } else {
            const skillWords = skills.split(" ").map((word) => {
              return word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            });
            req.session.jobs = skillWords;
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
            res.redirect("/job/scan");
          }
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .send({ message: "Lỗi khi xử lý và tìm kiếm công ty phù hợp." });
        }
      }
    });
  }
}

module.exports = new ApplyCVController();
