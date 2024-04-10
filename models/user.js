var Role = require('./role');

class User {
    constructor(id, firstName, lastName, email, roleId, lang, fontSize, volume, birthDate, sex) {
      let _id = id;
      let _firstName = firstName;
      let _lastName = lastName;
      let _email = email;
      let _roleId = roleId;
      let _lang = lang;
      let _fontSize = fontSize;
      let _volume = volume;
      let _birthDate = birthDate;
      let _sex = sex;

      this.getId = () => _id;
      this.getFirstName = () => _firstName;
      this.getLastName = () => _lastName;
      this.getEmail = () => _email;
      this.getRoleId = () => _roleId;
      this.getLang = () => _lang;
      this.getFontSize = () => _fontSize;
      this.getVolume = () => _volume;
      //Returns a UNIX timestamp
      this.getBirthDate = () => _birthDate;
      this.getSex = () => _sex;
    }

    getFullName() {
        return this.getFirstName() + " " + this.getLastName();
    }

    //getRole() //Needs class Role
    getRole() {
      return new Role(this.getRoleId());
    }

    getBirthDateFormatted() {
        const date = new Date(this.getBirthDate() * 1000);
        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
    }

  }
  
  module.exports = User;