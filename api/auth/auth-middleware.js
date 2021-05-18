/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/

const { findBy: findUsersBy } = require('../users/users-model.js')

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}

function restricted(req, res, next) {
  if(req.session.user)
    next()
  else
    next({ message: 'You shall not pass!', status: 401 })
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const users = await findUsersBy({ username: req.body.username })
  if(users.length === 0)
    next();
  else
    next({ status: 422, message: 'Username taken' })
}


/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const [user] = await findUsersBy({ username: req.body.username })
  if(user){
    req.user = user
    next()
  } else {
    next({ status: 401, message: 'Invalid credentials' })
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if(typeof(req.body.password) === 'string' && req.body.password.length > 3)
    next()
  else
    next({ status: 422, message: 'Password must be longer than 3 chars' })
}

// Don't forget to add these to the `exports` object so they can be required in other modules
