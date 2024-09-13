class Role {
  constructor(id, name, libelle) {
    let _id = id;
    let _name = name;
    let _libelle = libelle;
    this.getId = () => _id;
    this.getName = () => _name;
    this.getLibelle = () => _libelle;
  }
}

module.exports = Role;