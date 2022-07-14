const router = require("express").Router();
const Fields = require('../models/field.model');
const fileUploader = require('../config/cloudinary.config');


router.get('/fields', (req, res, next) => {

    Fields.find()
    .then (allFields => { 
      console.log (allFields);
      res.render('fields/fields.hbs', { allFields });
    })
    .catch (err => {
      console.log(err);
    });
});

router.get('/fields/create', (req, res, next) => {
  res.render ('fields/create.hbs');
});

router.post('/fields', fileUploader.single('field-image'), (req, res, next) => {
    const { fieldname, address, hours, contact } = req.body;
    Fields.create ({
      fieldname,
      address,
      hours,
      contact,
      imageUrl: req.file.path })
      .then (createdField => {
        console.log('Newly created field: ', createdField);
        res.redirect('/fields');
    })
    .catch(error => next(error)); 
});

/* router.get('/fields/:id', (req, res, next) => {
    Fields.findById(req.params.id)
    .then (field => {
      res.render('/fields/detail', { field });
    })
    .catch (err => {
      console.log(err);
    });
}); */

router.get('/fields/detail/:fieldId', (req, res, next) => {
  const { fieldId } = req.params;
 
  Fields.findById(fieldId)
    .then(theField => res.render('fields/detail.hbs', theField))
    .catch(error => {
      console.log('Error while retrieving field details: ', error); 
      next(error);
    });
});

router.get('/fields/detail/edit/:fieldId' , (req, res, next) => {
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
});


router.post('/fields/:fieldId/delete', (req, res, next) => {
  const { fieldId } = req.params;
 
  Fields.findByIdAndDelete(fieldId)
    .then(() => res.redirect('/fields'))
    .catch(error => next(error));
});


module.exports = router;