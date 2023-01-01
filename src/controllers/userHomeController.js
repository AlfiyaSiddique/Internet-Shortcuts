import database from "../model/database.js"

const getUserHome = async (req, res) => {
  const query = `select * from table${req.user.userid}`;
  const data = await database.commonMethod(query);
  res.render("userHome", { data: data, name: req.user.name })
}

const storeUserData = async (body, user) => {
  try {
    let query = `insert into table${user.userid} (websiteName, URL) values ('${body.websiteName}', '${body.url}')`;
    await database.commonMethod(query);
    query = `select * from table${user.userid}`
    const data = await database.commonMethod(query);
    return data[data.length - 1];
  } catch (e) {
    throw e;
  }
}

const visitLink = async (req, res) => {
  let query = "";
  if (req.headers['origin'] === 'https://www.freecodecamp.org') {
    query = `select URL from freecodecampURL where id = ${req.params.num}`
  } else {
    query = `select URL from table${req.user.userid} where dataId = ${req.params.num}`
  }
  const destination = await database.commonMethod(query);
  res.redirect(destination[0].URL);
}

const freecodecamp = async (body) => {
  let query = `select * from freecodecampURL where URL = '${body.url}'`
  let data = await database.commonMethod(query);
  if (data.length === 0) {
    query = `insert into freecodecampURL (URL) values ('${body.url}')`;
    await database.commonMethod(query);
    query = `select * from freecodecampURL where URL = '${body.url}'`;
    data = await database.commonMethod(query);
  }
  return data[0];
}

const deleteURL = async (req, res) => {
  let query = `delete from table${req.user.userid} where dataId = ${req.body.dataID}`
  await database.commonMethod(query);
  res.redirect("/userHome")
}

const deleteUser = async (req, res) => {
  const id = req.user.userid;
  let query = `drop table table${id}`
  await database.commonMethod(query);
  req.session.destroy((err) => { console.log(err) });
  database.commonMethod(`delete from users 
  where userid  = ${id}`)
  res.redirect("/");
}

const userHomeController = {
  getUserHome: getUserHome,
  storeUserData: storeUserData,
  visitLink: visitLink,
  freecodecamp: freecodecamp,
  deleteURL: deleteURL,
  deleteUser: deleteUser
}

export default userHomeController;
