

module.exports = class GeneralUtils {

    static validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    static validateProfileName(name){
      if(name > 30) {return false;}
      let validNameRegex = /^[^@#$%^*~=\/\\]+$/;
      return validNameRegex.test(name);
    }

};