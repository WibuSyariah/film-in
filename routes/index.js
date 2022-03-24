const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const upload = require('../middleware/multer.js')

router.get('/', Controller.loginPage)
router.post('/', Controller.login)
router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)
router.get('/createProfile', Controller.createProfileForm)
router.post('/createProfile', Controller.createProfile)
router.get('/logout', Controller.logout)

router.use(function (req, res, next) {
  if (!req.session.UserId) {
    const error = "You're not logged in";
    res.redirect(`/?err=${error}`);
  } else {
    next();
  }
});

router.get('/dashboard', Controller.dashboard)

router.get('/explore', Controller.explore)

router.get('/delete/:FilmId', Controller.deleteFilm)

router.get('/edit/:FilmId', Controller.editForm)

router.post('/edit/:FilmId', upload.single('imgUrl'), Controller.submitEdit)

router.get('/postFilm', Controller.postFilmForm)

router.post('/postFilm/', upload.single('imgUrl'), Controller.postFilm)

module.exports = router