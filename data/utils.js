const crypto = require('crypto');


module.exports = {
  generateID() {
    return crypto.randomBytes(16).toString('base64');
  },
}