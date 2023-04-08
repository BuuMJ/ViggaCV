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
  getAvatar: function (user) {
    if (user.avatar) {
      return `/${user.avatar}`;
    } else {
      return "/img/profileimg.png";
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
      return "/img/logoleadership.jpeg";
    }
  },
  getBackground: function (company) {
    if (company && company.background) {
      return `/${company.background}`;
    } else {
      return "/img/headerprofile.jpeg";
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
      return "";
    }
  },
  getCompanyfield: function (company) {
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
      return "";
    }
  },
  getCompanyemail: function (company) {
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
      return "";
    }
  },
  getCompanyyears: function (company) {
    if (company && company.companyyears) {
      return company.companyyears;
    } else {
      return "";
    }
  },
  getCompanydesc: function (company) {
    if (company && company.companydesc) {
      return company.companydesc;
    } else {
      return "";
    }
  },
  getTOB: function (company) {
    if (company && company.typeofbusiness) {
      return company.typeofbusiness;
    } else {
      return "Choose Type Of Your Business";
    }
  },
  getService: function (company) {
    if (company && company.servicedesc ) {
      return company.servicedesc ;
    } else {
      return "There is no information about the service, you can contact the company to learn more";
    }
  },
  getEstablisheddate: function (company) {
    if (company && company.establisheddate ) {
      return company.establisheddate ;
    } else {
      return "";
    }
  },
  getNoofemployee: function (company) {
    if (company && company.noofemployee ) {
      return company.noofemployee ;
    } else {
      return "The company has not updated the total number of employees";
    }
  },
  getMission: function (company) {
    if (company && company.mission ) {
      return company.mission ;
    } else {
      return "There is no information about the mission, you can contact the company to learn more";
    }
  },
  getHistory: function (company) {
    if (company && company.history ) {
      return company.history ;
    } else {
      return "The company has not updated its operating history";
    }
  },
  getJobcount: function (jobcount) {
    if (jobcount ) {
      return jobcount;
    } else {
      return "0";
    }
  },
  checkFl: function (checkfl){
    if(checkfl){
      return "Following"
    }
    else{
      return "Follow"
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
