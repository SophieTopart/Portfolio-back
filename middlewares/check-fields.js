const checkAuthFields = (req, res, next) => {
    const { username, password } = req.body
    
      if (!username || !password) {
        res.status(422).json({
          errorMessage: 'One field is missing'
        })
      }
      return next()
    }
    
    module.exports = checkAuthFields