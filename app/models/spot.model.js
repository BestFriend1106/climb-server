module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      walletAddress: String,
      published: Boolean,
      winStatus: Number
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Spot = mongoose.model("spot", schema);
  return Spot;
};
