import mysql2 from "mysql2";
import bcrypt from "bcrypt";

const connection = mysql2.createPool({
  host: process.env["DB_HOST"],
  database: process.env["DB_NAME"],
  user: process.env["DB_USER"],
  password: process.env["DB_PASSWORD"],
  port: process.env["DB_PORT"],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const createUser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkEmailUser(user.email);
      if (check) {
        reject(`The email ${user.email} already exist. Try with another email.`)
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);
      connection.query(`insert into users (email, name, password) values ('${user.email}','${user.name}','${hash}')`, (err, rows) => {
        if (err) {
          const message = errorType(err.errno);
          reject(message)
        }
        else {
          connection.query(`select * from users where email='${user.email}'`, (err, rows) => {
            if (rows) {
              createUserTable(rows[0].userid)
            }
            else { console.log(err) }
          })
          resolve("Account Created Successfully! Log In")
        }
      })
    } catch (e) {
      reject(e)
      console.log("" + e)
    }
  })
}

function errorType(id) {
  if (id == id) {
    return "This Username already exist";
  }
}

const createUserTable = (id) => {
  const command = `CREATE TABLE table${id} ( dataId INT UNIQUE NOT NULL AUTO_INCREMENT, websiteName VARCHAR(45) NOT NULL, URL VARCHAR(100) NOT NULL UNIQUE, PRIMARY KEY (dataId));`
  connection.query(command, (err) => {
    if (err) console.log(err);
  })
}

const checkEmailUser = (email) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(`select * from users where email = '${email}'`, (err, row) => {
        if (err) reject(err);
        console.log(row)
        if (row.length > 0) { resolve(true) }
        resolve(false);
      })
    } catch (e) {
      console.log("" + e)
      reject(e);
    }
  })
}


const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(`select * from users where email = '${email}'`, (err, row) => {
        if (err) reject(err);
        let user = row[0];
        resolve(user);
      })
    } catch (e) {
      console.log("123" + e)
      reject(e);
    }
  })
}

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(`select * from users where userid = '${id}'`, (err, row) => {
        if (err) reject(err);
        let user = row[0];
        resolve(user);
      })
    } catch (e) {
      console.log("2" + e)
      reject(e);
    }
  })
}

const comparePassword = (password, user) => {
  return new Promise((resolve, reject) => {
    try {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) resolve(true);
      else reject("The password is incorrect")

    } catch (e) {
      console.log("3" + e)
      reject(e)
    }
  })
}


const commonMethod = (sql) => {
  return new Promise((resolve, reject) => {
    try {
      connection.query(sql, (err, field) => {
        if (err) reject(err);
        resolve(field)
      })
    } catch (e) {
      reject(e)
    }
  })
}

const database = {
  createUser: createUser,
  getUserByEmail: getUserByEmail,
  comparePassword: comparePassword,
  getUserById: getUserById,
  commonMethod: commonMethod,
  connection: connection
};

export default database;
