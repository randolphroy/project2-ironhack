const router = require('express').Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const fileUploader = require('../config/cloudinary.config');

//GET home page


router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', fileUploader.single('profile-image'), (req, res, next) => {
  console.log("The form data: ", req.body, req.file);
 
  const { username, email, position, city, state , password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      //console.log(`Password hash: ${hashedPassword}`);
      return User.create ({
        username,
        email,
        position,
        city,
        state,
        imageUrl: req.file.path,
        password: hashedPassword        
      })
    })
    .then(createdUser => {
        console.log('Newly created user: ', createdUser);
        req.session.currentUser = createdUser;
        res.redirect('/dashboard');
    })
    .catch(error => next(error));
}); 

router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
 
/*   if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  } */
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect ('/dashboard');     
      } else {
        //res.render('auth/login', { errorMessage: 'Incorrect password.' });
        res.send('try again')
      }
    })
    .catch(error => next(error));
});

/* router.get('/userProfile', (req, res) => {
  res.render('users/dashboard', { userInSession: req.session.currentUser });
});
 */

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/auth/login');
  });
});

/* router.get('/users/detail/edit/:fieldId' , (req, res, next) => {
  const { fieldId } = req.params;

  Fields.findById(fieldId)
    .then(editedField => {
      res.render('fields/edit.hbs', editedField);
    })
    .catch(error => {
      console.log('Error while retrieving field details: ', error); 
      next(error);
    });
})

router.post('/fields/detail/edit/:fieldId', (req, res, next) => {
  const { fieldId } = req.params;
  const { fieldname, address, hours, contact } = req.body;
 
  Fields.findByIdAndUpdate(fieldId, { fieldname, address, hours, contact }, { new: true })
    .then(updatedField => res.redirect(`/fields/detail/${updatedField.id}`)) // go to the details page to see the updates
    .catch(error => next(error));
}); */


router.get('/fields/detail', (req, res) => res.render('fields/detail.hbs'));

router.get('/fields/create', (req, res) => res.render('fields/create.hbs'));



router.get('/dashboard', (req, res) => res.render('users/dashboard', { userInSession: req.session.currentUser }));

module.exports = router;