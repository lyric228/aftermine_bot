import Database from "better-sqlite3";


export class DB {
  constructor() {
    this.id = 6237798050;
    this.db = new Database("server/db/admins.db");
    this.createTable();
  }

  createTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        tgid INTEGER UNIQUE,
        status TEXT DEFAULT 'none',
        server TEXT DEFAULT 'masedworld',
        portal TEXT DEFAULT 's2',
        chat BOOLEAN DEFAULT 0,
        rg BOOLEAN DEFAULT 0,
        packets BOOLEAN DEFAULT 0
      );
    `);
  }

  createUser(id = this.id) {
    try {
      if (id === null) return;
      this.db.prepare(`INSERT INTO admins (tgid) VALUES (?)`).run(id);
    } catch (err) {}
  }

  updateData(field, value, searchValue = this.id, searchField = "tgid") {
    try {
      this.db.prepare(`UPDATE admins SET ${field} = ? WHERE ${searchField} = ?`).run(value, searchValue);
    } catch (err) {
      this.createUser();
    }
  }

  getAllData(searchValue = this.id, searchField = "tgid") {
    try {
      return this.db.prepare(`SELECT * FROM admins WHERE ${searchField} = ?`).get(searchValue);
    } catch (err) {
      this.createUser();
    }
  }

  getData(field, searchValue = this.id, searchField = "tgid") {
    try {
      return this.getAllData(searchValue, searchField)[field];
    } catch (err) {
      this.createUser();
    }
  }

  getAllWhere(getvalue, searchvalue, value) {
    return this.db.prepare(`SELECT ${getvalue} FROM admins WHERE ${searchvalue} = ${value}`).all();
  }
}
