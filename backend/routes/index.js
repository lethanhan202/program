const express = require('express')

const router = express.Router()

const userSignUpController = require('../controller/userSignUp.js')
const userSignInController = require('../controller/userSignIn.js')
const userDetailController = require('../controller/userDetail.js')
const authToken = require('../middleware/authToken.js')
const userLogout = require('../controller/userLogout.js')
const allUsers = require('../controller/allUsers.js')
const updateUser = require('../controller/updateUser.js')

router.post("/signup", userSignUpController)
router.post("/signin", userSignInController)
router.get("/user-details", authToken, userDetailController)
router.get("/userLogout", userLogout)

//admin panel
router.get("/all-user", authToken, allUsers)
router.post("/update-user", authToken, updateUser)

module.exports = router