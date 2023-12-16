const moment = require('moment');
module.exports = {
  getName: function (user) {
    return user.username;
  },
  getRole: function (user) {
    return user.role;
  },
  getFullname: function (user) {
    return user.fullname;
  },
  getEmail: function (user) {
    return user.email;
  },
  getPassword: function (user) {
    return user.password;
  },
  getPhone: function (user) {
    return user.phone;
  },
  getAddress: function (user) {
    return user.address;
  },
  getCity: function (user) {
    return user.city;
  },
  getCountry: function (user) {
    return user.country;
  },
  getPostal: function (user) {
    return user.postal;
  },
  getExperience: function (user) {
    return user.experience;
  },
  getEducation: function (user) {
    return user.education;
  },
  getSkills: function (user) {
    return user.skills;
  },
  getCertifications: function (user) {
    return user.certifications;
  },
  getLanguages: function (user) {
    return user.languages;
  },
  getId: function (user) {
    return user._id;
  },
  getSpecialized: function (user) {
    return user.specialized;
  },
  getBirthday: function (user) {
    if(user && user.birthday){
      return moment(user.birthday).format("DD/MM/YYYY");
    }else{
      return "";
    }
  },
  getBirthdayProfile: function (user) {
    if(user && user.birthday){
      return moment(user.birthday).format("yyyy-MM-DD");
    }else{
      return "";
    }
  },
  getAvatar: function (user) {
    if (user && user.avatar) {
      return `/${user.avatar}`;
    } else {
      return "/img/profileimg.png";
    }
  },
  getIDcompany: function (company) {
    if (company && company._id) {
      return company._id;
    } else {
      return "";
    }
  },
  getAvatarcompany: function (company) {
    if (company && company.avatar) {
      return `/${company.avatar}`;
    } else {
      return "/img/logocompany.jpeg";
    }
  },
  getAvatarleadership: function (leader) {
    if (leader && leader.avatar) {
      return `/${leader.avatar}`;
    } else {
      return "/img/logoleadership.png";
    }
  },
  getAvatarJoba: function (joba) {
    if (joba && joba.avatar) {
      return `/${joba.avatar}`;
    } else {
      return "/img/logocompany.jpeg";
    }
  },
  getAvatarCPBest: function (bestCP) {
    if (bestCP && bestCP.avatar) {
      return `/${bestCP.avatar}`;
    } else {
      return "/img/logocompany.jpeg";
    }
  },
  getAvatarCPRandom: function (random) {
    if (random && random.avatar) {
      return `/${random.avatar}`;
    } else {
      return "/img/logocompany.jpeg";
    }
  },
  getbackgroundCPRandom: function (random) {
    if (random && random.background) {
      return `/${random.background}`;
    } else {
      return "/img/logocompany.jpeg";
    }
  },
  getbackgroundJobBest: function (bestFL) {
    if (bestFL && bestFL.background) {
      return `/${bestFL.background}`;
    } else {
      return "/img/logocompany.jpeg";
    }
  },
  getbackgroundCPBest: function (bestCP) {
    if (bestCP && bestCP.background) {
      return `/${bestCP.background}`;
    } else {
      return "/img/logocompany.jpeg";
    }
  },

  getBackground: function (company) {
    if (company && company.background) {
      return `/${company.background}`;
    } else {
      return "/img/headerprofile.jpeg";
    }
  },
  getCompanyID: function (company) {
    if (company && company._id) {
      return company._id;
    } else {
      return "";
    }
  },
  getCompanyname: function (company) {
    if (company && company.companyname) {
      return company.companyname;
    } else {
      return "";
    }
  },
  getCompanyaddress: function (company) {
    if (company && company.companyaddress) {
      return company.companyaddress;
    } else {
      return "Not updated yet";
    }
  },
  getCompanyaddressProfile: function (company) {
    if (company && company.companyaddress) {
      return company.companyaddress;
    } else {
      return "";
    }
  },
  getCompanyfield: function (company) {
    if (company && company.companyfield) {
      return company.companyfield;
    } else {
      return "Not updated yet";
    }
  },
  getCompanyfieldProfile: function (company) {
    if (company && company.companyfield) {
      return company.companyfield;
    } else {
      return "";
    }
  },
  getTaxcode: function (company) {
    if (company && company.taxcode) {
      return company.taxcode;
    } else {
      return "Not updated yet";
    }
  },
  getTaxcodeProfile: function (company) {
    if (company && company.taxcode) {
      return company.taxcode;
    } else {
      return "";
    }
  },
  getCompanyemail: function (company) {
    if (company && company.companyemail) {
      return company.companyemail;
    } else {
      return "Not updated yet";
    }
  },
  getCompanyemailProfile: function (company) {
    if (company && company.companyemail) {
      return company.companyemail;
    } else {
      return "";
    }
  },
  getCompanyphone: function (company) {
    if (company && company.companyphone) {
      return company.companyphone;
    } else {
      return "Not updated yet";
    }
  },
  getCompanyphoneProfile: function (company) {
    if (company && company.companyphone) {
      return company.companyphone;
    } else {
      return "";
    }
  },
  getCompanyyears: function (company) {
    if (company && company.companyyears) {
      return company.companyyears + " years";
    } else {
      return "Not updated yet";
    }
  },
  getCompanyyearsProfile: function (company) {
    if (company && company.companyyears) {
      return company.companyyears;
    } else {
      return "Not updated yet";
    }
  },
  getCompanydesc: function (company) {
    if (company && company.companydesc) {
      return company.companydesc;
    } else {
      return "The information has not been updated";
    }
  },
  getTOB: function (company) {
    if (company && company.typeofbusiness) {
      return company.typeofbusiness;
    } else {
      return "Choose Your Type Of Business";
    }
  },
  getService: function (company) {
    if (company && company.servicedesc) {
      return company.servicedesc;
    } else {
      return "There is no information about the service, you can contact the company to learn more";
    }
  },
  getServiceProfile: function (company) {
    if (company && company.servicedesc) {
      return company.servicedesc;
    } else {
      return "The information has not been updated";
    }
  },
  getEstablisheddate: function (company) {
    if (company && company.establisheddate) {
      return moment(company.establisheddate).format("DD/MM/YYYY");
    } else {
      return "(Not updated yet)";
    }
  },
  getEstablisheddateProfile: function (company) {
    if (company && company.establisheddate) {
      return company.establisheddate
    } else {
      return "(Not updated yet)";
    }
  },
  getNoofemployee: function (company) {
    if (company && company.noofemployee) {
      return company.noofemployee + " staff";
    } else {
      return "Not updated yet";
    }
  },
  getNoofemployeeProfile: function (company) {
    if (company && company.noofemployee) {
      return company.noofemployee;
    } else {
      return "Not updated yet";
    }
  },
  getMission: function (company) {
    if (company && company.mission) {
      return company.mission;
    } else {
      return "There is no information about the mission, you can contact the company to learn more";
    }
  },
  getMissionProfile: function (company) {
    if (company && company.mission) {
      return company.mission;
    } else {
      return "The information has not been updated";
    }
  },
  getHistory: function (company) {
    if (company && company.history) {
      return company.history;
    } else {
      return "The company has not updated its operating history";
    }
  },
  getHistoryProfile: function (company) {
    if (company && company.history) {
      return company.history;
    } else {
      return "The information has not been updated";
    }
  },
  getJobcount: function (jobcount) {
    if (jobcount) {
      return jobcount;
    } else {
      return "0";
    }
  },
  // checkFl: function (checkfl) {
  //   if (checkfl) {
  //     return "Following";
  //   } else {
  //     return "Follow";
  //   }
  // },
  checkSave: function (checksave) {
    if (checksave === undefined) {
      return "false";
    } else {
      return "true";
    }
  },
  ifeq: function (user, y, options) {
    // console.log(user)
    var currentRole = user == undefined ? "" : user.role;
    // console.log(currentRole)
    // console.log(y)
    if (currentRole === y) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  get: function (array, index) {
    return array[index];
  },
  getfullnamecv: function (cvuser) {
    return cvuser.fullnamecv;
  },
  getemailcv: function (cvuser) {
    return cvuser.emailcv;
  },
  getphonecv: function (cvuser) {
    return cvuser.phonecv;
  },
  getoverview: function (cvuser) {
    return cvuser.overview;
  },
  getnamecompany: function (cvuser) {
    return cvuser.namecompany;
  },
  getaddrcompany: function (cvuser) {
    return cvuser.addrcompany;
  },
  getdurationcompany: function (cvuser) {
    return cvuser.durationcompany;
  },
  getnameprofession: function (cvuser) {
    return cvuser.nameprofession;
  },
  getdescprofession: function (cvuser) {
    return cvuser.descprofession;
  },
  getnameschool: function (cvuser) {
    return cvuser.nameschool;
  },
  getaddrschool: function (cvuser) {
    return cvuser.addrschool;
  },
  getdurationschool: function (cvuser) {
    return cvuser.durationschool;
  },
  getnameprofessionschool: function (cvuser) {
    return cvuser.nameprofessionschool;
  },
  getdescprofessionschool: function (cvuser) {
    return cvuser.descprofessionschool;
  },
  getdescproject: function (cvuser) {
    return cvuser.descproject;
  },
  getnameproject: function (cvuser) {
    return cvuser.nameproject;
  },
  getnameskill: function (cvuser) {
    return cvuser.nameskill;
  },
  getskilllv1: function (cvuser) {
    return cvuser.skilllv1;
  },
  getskilllv2: function (cvuser) {
    return cvuser.skilllv2;
  },
  getskilllv3: function (cvuser) {
    return cvuser.skilllv3;
  },
  getskilllv4: function (cvuser) {
    return cvuser.skilllv4;
  },
  getskilllv5: function (cvuser) {
    return cvuser.skilllv5;
  },
  getactivities: function (cvuser) {
    return cvuser.activities;
  },
  getavatarcv: function (cvuser) {
    if (cvuser.avatar) {
      return `/${cvuser.avatar}`;
    } else {
      return "";
    }
  },
};
