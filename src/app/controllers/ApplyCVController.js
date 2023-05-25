const textract = require("textract");
const nlp = require("compromise");

class ApplyCVController {
  async apply(req, res, next) {
    textract.fromFileWithPath(req.file.path, function (error, text) {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ message: "Lỗi khi trích xuất văn bản từ tệp tài liệu." });
      } else {
        const terms = nlp(text).terms().data();

        console.log(text);
        // Tìm các thuật ngữ liên quan đến kinh nghiệm làm việc
        const experienceTerms = terms.filter((term) => {
          if (
            term.terms &&
            Array.isArray(term.terms) &&
            term.terms.length > 0
          ) {
            const firstTerm = term.terms[0];
            return (
              firstTerm.normal.includes("years of experience") &&
              firstTerm.tags.includes("Noun")
            );
          }
          return false;
        });
        console.log("Experience terms: ", experienceTerms);

        const experienceTerm = terms.find((term) => term.text === "years");

        if (experienceTerm) {
          console.log("Experience term: ", experienceTerm);

          // Truy cập vào thuộc tính terms của experienceTerm để lấy thông tin chi tiết
          const experienceTermDetail = experienceTerm.terms[0];
          console.log("Experience term detail: ", experienceTermDetail);
          console.log("Term text: ", experienceTermDetail.text);
          console.log("Term normal: ", experienceTermDetail.normal);
          console.log("Term tags: ", experienceTermDetail.tags);
        } else {
          console.log("Không tìm thấy thuật ngữ experience.");
        }
        if (experienceTerms.length > 0) {
          // Lấy giá trị kinh nghiệm từ thuật ngữ đầu tiên có liên quan đến kinh nghiệm làm việc
          const experienceValue = parseInt(
            experienceTerms[0].text.replace(/\D/g, "")
          );
          console.log("Kinh nghiệm làm việc:", experienceValue, "năm");
        } else {
          console.log(
            "Không tìm thấy thông tin kinh nghiệm làm việc trong CV."
          );
        }
        // console.log(terms);
      }
    });
  }
}

module.exports = new ApplyCVController();