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
    getPassword: function(user){
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
      return user.postalcode;
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
  };
  