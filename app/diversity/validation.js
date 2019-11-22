const { body } = require('express-validator')

const validation = () => {
  return [
    body('diversity')
      .isLength({ min: 1 })
      .withMessage('Record how you will take account of diversity factors'),
    body('diversity')
      .isLength({ max: 5 })
      .withMessage('ooops I did it again from within me own postcontroller innit'),
  ]
}

module.exports = { validation }
