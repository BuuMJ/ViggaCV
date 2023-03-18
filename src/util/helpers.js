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
  