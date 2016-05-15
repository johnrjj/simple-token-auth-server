import bcrypt from 'bcrypt';
const saltRounds = 10;

const generateHash = (plaintextPassword) =>
  new Promise((accept, reject) => {
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
      if (saltErr) {
        reject(saltErr);
      } else {
        bcrypt.hash(plaintextPassword, salt, (hashErr, hash) => {
          if (hashErr) {
            reject(hashErr);
          } else {
            accept(hash);
          }
        });
      }
    });
  });

const comparePassword = (plaintextPassword, hash) =>
  new Promise((accept, reject) => {
    bcrypt.compare(plaintextPassword, hash, (err, res) => {
      if (err) {
        reject(err);
      } else {
        accept(res);
      }
    });
  });

export {
  generateHash,
  comparePassword,
};
