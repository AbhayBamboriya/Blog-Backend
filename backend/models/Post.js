import { DataTypes } from "sequelize";
// import sequelize from "../config/db.js";
import sequelize from "../config/dbConnection.js";

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorId:{
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  name:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM("DRAFT", "PUBLISHED"),
    defaultValue: "DRAFT",
  },
});

export default Post;
