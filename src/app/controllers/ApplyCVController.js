const fs = require("fs");
const path = require("path");
const nlp = require("compromise");
const textract = require("textract");
const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");
const QualifiedModel = require("../models/Qualified");
const nodemailer = require("nodemailer");
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
      if (error) {
        console.log(error);
        return res.status(500);
      } else {
        try {
          const jobID = req.query.id;
          const job = await JobModel.findById({ _id: jobID, active: true });
          const company = await CompanyModel.findById(job.idcompany);
          const jobDescription = job.jobrequi;
          const cvText = text;
          const doc = nlp(jobDescription);
          const nouns = doc.nouns().out("array");
          const user = req.user;
          const namedEntities = doc
            .people()
            .concat(doc.places())
            .concat(doc.organizations())
            .out("array");
          const keywords = [...new Set([...nouns, ...namedEntities])];

          let score = 0;
          keywords.forEach((keyword) => {
            if (cvText.toLowerCase().includes(keyword.toLowerCase())) {
              score++;
            }
          });
          let destinationFolder;
          if (score / keywords.length > 0.5) {
            destinationFolder = `/applyCV/${company.companyname}/${job.jobname}/Qualified`;
          } else {
            destinationFolder = `/applyCV/${company.companyname}/${job.jobname}/Unsatisfactory`;
          }

          // Tạo newPath
          const projectRoot = path.join(__dirname, "..", "..", "..");
          const absoluteDestination = path.join(
            projectRoot,
            "uploads",
            destinationFolder
          );
          const newPath = `${absoluteDestination}/${req.file.filename}.pdf`;
          fs.mkdirSync(absoluteDestination, { recursive: true });
          const finalScore = score / keywords.length;
          if (score / keywords.length > 0.5) {
            await QualifiedModel.create({
              nameCV: req.file.originalname,
              path: newPath,
              jobid: job._id,
              companyid: company._id,
              userid: user._id,
              name: req.user.fullname,
              email: req.user.email,
              phone: req.user.phone,
              professional: req.body.professional,
              score: finalScore,
            });
          } else {
            await UnsatisfactoryModel.create({
              nameCV: req.file.originalname,
              path: newPath,
              jobid: job._id,
              companyid: company._id,
              userid: user._id,
              name: req.user.fullname,
              email: req.user.email,
              professional: req.body.professional,
              phone: req.user.phone,
              score: finalScore,
            });
          }
          fs.rename(req.file.path, newPath, (err) => {
            if (err) {
              console.error("Error moving file:", err);
              return res
                .status(500)
                .send({ message: "Lỗi khi di chuyển file." });
            }
          });
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "duoc6694@gmail.com",
              pass: "wdymtvgbhblstfbj",
            },
          });
          const linkJob = `https://vigga-careers.onrender.com//job`;
          const mailOptions = {
            to: req.user.email, // list of receivers
            subject: "ViggaCareers ", // Subject line<a href="${linkJob}">here</a>
            html: `
                  <html>
                    <head>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                          line-height: 1.6;
                          color: #333;
                        }
                        h1 {
                          color: #0066cc;
                        }
                        .message {
                          background-color: #f9f9f9;
                          padding: 15px;
                          border-radius: 5px;
                        }
                        .cta-button {
                          display: inline-block;
                          background-color: #0066cc;
                          color: #ffffff !important;
                          text-decoration: none;
                          padding: 10px 15px;
                          border-radius: 3px;
                        }
                        .cta-button:hover {
                          background-color: #004c99;
                        }
                      </style>
                    </head>
                    <body>
                      <h1>ViggaCareers</h1>
                      <div class="message">
                        <p>Bạn đã apply công việc thành công.</p>
                        <p>Vui lòng nhấp vào nút bên dưới để xem công việc mới.</p>
                        <p><a href="${linkJob}" class="cta-button">Xem các công việc khác</a></p>
                      </div>
                    </body>
                  </html>
                `, // plain text body
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              console.log("Đã gửi mail cho người đăng kí Jobs");
            }
          });
          res.redirect("back");
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
