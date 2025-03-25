const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  disease: {
    type: String,
    required: true,
    enum: ["Autism", "Down Syndrome", "ADHD", "Cerebral Palsy", "Others"]
  },
  articleUrls: [{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
articleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
