const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: {
    first: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "First name is required"],
      unique: true,
      message: "This message is generic"
    },
    last: {
      trim: true,
      uppercase: true,
      message: "this is a message",
    }
  },
  phone: {
    type: String,
    validate: [
      {
        validator: function(number) {
          return /\d{3}-\d{3}-\d{4}/.test( number );
        }
        message: "{VALUE} failed this validator"
      },
      {

      }
    ],
  },

  gender: {
    type: String,
    uppercase: true,
    enum: ['MALE', 'FEMALE'],
    trim: true,
    default: 'MALE'
  },

  age: {
    type: Number,
    min: [18, "You are not old enough"],
    max: [45, "Far too old"],
    required: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 32,
    validate: {
      validator: function(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( password );
      },
      message: "Password failed validation, you must have at least 1 number, uppercase and special character"
    }
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  dob: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

someInstance.name.full
someInstance.findChildren(function(){});
Customer.findByName("Bob", function(){})

CustomerSchema.virtual('name.full').get(function() {
  return `${this.name.first} ${this.name.last}`;
});

CustomerSchema.methods.findChildren = function(callback) {

}

CustomerSchema.statics.findbyName = function(name, callback) {
  return this.find({ name: new Regexp(name, 'i')}, callback);
}

mongoose.model('Customer', CustomerSchema);
