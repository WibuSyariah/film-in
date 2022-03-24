const { User, Profile, Film } = require('../models')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const dateFormat = require('../helpers/dateFormat');

class Controller {
  static loginPage(req, res) {
    res.render("login");
  }

  static login(req, res) {
    let { username, password } = req.body;
    User.findOne({
      where: { username },
    })
      .then((data) => {
        if (data) {
          let id = data.id;
          let role = data.role;
          console.log(role, "INI ADALAH ROLE");
          let validate = bcrypt.compareSync(password, data.password);
          if (validate) {
            req.session.role = role;
            req.session.UserId = id;
            res.redirect(`/dashboard`);
          } else {
            const err = "password or username wrong";
            res.redirect(`/?err=${err}`);
          }
        } else {
          const err = "You're not registered";
          res.redirect(`/register?err=${err}`);
        }
      })
      .catch((err) => {
        err = err.errors.map((el) => el.message);
        res.send(err);
      })
  }

  static registerForm(req, res) {
    const err = req.query.err;
    res.render("register", { err });
  }

  static register(req, res) {
    const { email, username, password } = req.body;
    const createdAt = new Date();
    const updatedAt = new Date();
    User.create({
      username,
      email,
      password,
      createdAt,
      updatedAt,
    })
      .then((data) => res.redirect(`/createProfile?id=${data.id}`))
      .catch((err) => {
        err = err.errors.map((el) => el.message);
        res.redirect(`/register?err=${err}`);
      })
  }

  static createProfileForm(req, res) {
    const id = req.query.id;
    res.render("createProfileForm", { id });
  }

  static createProfile(req, res) {
    const { alias, biodata } = req.body;
    const UserId = req.query.id;
    const createdAt = new Date();
    const updatedAt = new Date();
    Profile.create({
      alias,
      biodata,
      UserId,
      createdAt,
      updatedAt,
    })
      .then((data) => {
        const notif = "Profile created";
        res.redirect(`/?notif=${notif}`);
      })
      .catch((err) => res.send(err));
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  static dashboard(req, res) {
    const { UserId } = req.session;

    User.findAll({
      where: {
        id: UserId,
      },
      include: Film,
    })
      .then((result) => {
        res.render("dashboard", { result, dateFormat });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static explore(req, res) {
    const { title } = req.query;
    const { role } = req.session;

    let condition = {};

    if (title) {
      condition.where = {
        ...condition.where,
        title: {
          [Op.iLike]: `%${title}%`,
        },
      };
    }

    Film.findAll(condition)
      .then((result) => {

        res.render("explore", { result, role, dateFormat });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static editForm(req, res) {
    const { role } = req.session
    const FilmId = req.params.FilmId;
    Film.findOne({
      where: {
        id: FilmId,
      },
    })
      .then((data) => res.render("editForm", { data, role }))
      .catch((err) => res.send(err));
  }

  static submitEdit(req, res) {
    const { title, synopsis, rating } = req.body;
    if (!req.file) {
      Film.update(
        {
          title: title,
          synopsis: synopsis,
          rating: rating
        },
        {
          where: {
            id: req.params.FilmId,
          },
        }
      )
        .then(() => res.redirect("/dashboard"))
        .catch((err) => res.send(err));
    } else {
      Film.update(
        {
          title: title,
          synopsis: synopsis,
          imgUrl: req.file.path,
        },
        {
          where: {
            id: req.params.FilmId,
          },
        }
      )
        .then(() => res.redirect("/dashboard"))
        .catch((err) => res.send(err));
    }
  }

  static postFilmForm(req, res) {
    User.findOne({
      where: {
        id: req.session.UserId,
      },
    }).then((data) => {
      let obj = {
        data,
      };
      res.render("postFilmForm", obj);
    });
  }

  static postFilm(req, res) {
    // console.log(req.body)

    const premierDate = Film.createDate()

    const UserId = req.session.UserId
    const { title, genre, synopsis } = req.body
    const imagePath = req.file.path
    const newFilm = {
      title: title,
      genre: genre,
      imgUrl: imagePath,
      UserId: UserId,
      premierDate: premierDate,
      synopsis: synopsis
    }
    Film.create(newFilm)
      .then((data) => res.redirect(`/dashboard`))
      .catch((err) => res.send(err))
  }

  static deleteFilm(req, res) {
    const { FilmId } = req.params;

    Film.destroy({
      where: { id: FilmId },
    })
      .then(() => {
        res.redirect("/dashboard");
      })
      .catch((err) => {
        res.send(err);
      });
  }
}

module.exports = Controller;
