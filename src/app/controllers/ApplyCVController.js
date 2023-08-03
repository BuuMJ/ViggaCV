const nlp = require("compromise");
const textract = require("textract");
const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");
const QualifiedModel = require("../models/Qualified");
const UnsatisfactoryModel = require("../models/Unsatisfactory");

class ApplyCVController {
  async scan(req, res, next) {
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

  apply(req, res, next) {
    textract.fromFileWithPath(req.file.path, async function (error, text) {
      // console.log("đây là văn bản sau khi scan cv: " + text);
      if (error) {
        console.log(error);
        return res.status(500);
        // .send({ message: "Lỗi khi trích xuất văn bản từ tệp tài liệu." });
      } else {
        try {
          const jobID = req.query.id;
          console.log(jobID);
          const job = await JobModel.findById({ _id: jobID });
          const company = await CompanyModel.findById(job.idcompany);
          const jobDescription = job.jobrequi;
          const cvText = text;
          const doc = nlp(jobDescription);
          const nouns = doc.nouns().out("array");
          const namedEntities = doc
            .people()
            .concat(doc.places())
            .concat(doc.organizations())
            .out("array");
          const keywords = [...new Set([...nouns, ...namedEntities])];

          let score = 0;
          keywords.forEach((keyword) => {
            if (cvText.includes(keyword)) {
              score++;
            }
          });
          console.log(`Score: ${score}/${keywords.length}`);
          let destinationFolder;
          if (score / keywords.length > 0.5) {
            QualifiedModel.create({
              name: req.file.name,
              part: a, // nhớ sửa chỗ này
              jobid: job._id,
              companyid: company._id,
            });
            destinationFolder = `/uploads/applyCV/${company.companyname}/${job.jobname}/Qualified`;
          } else {
            destinationFolder = `/uploads/applyCV/${company.companyname}/${job.jobname}/Unsatisfactory`;
          }
          // Tạo thư mục nếu chưa tồn tại
          fs.mkdirSync(destinationFolder, { recursive: true });

          // Di chuyển file
          const newPath = `${destinationFolder}`;
          fs.rename(req.file.path, newPath, (err) => {
            if (err) {
              console.error("Error moving file:", err);
              return res
                .status(500)
                .send({ message: "Lỗi khi di chuyển file." });
            }

            // (phần xử lý khác sau khi di chuyển file thành công)
            console.log(`File has been moved to: ${newPath}`);
          });
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
