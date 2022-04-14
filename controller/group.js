const { client: mongoClient } = require("../model/mongodb");

// Connect to MongoDB database
const dbConnection = mongoClient.db("chat_application");

// Initialize the collections for the database
const groupCollection = dbConnection.collection("group_details");

/**
 * Check if group exists
 * @param {string} group_name Name of the group to check
 * @returns true if group exists else false
 */
const is_exist = async (group_name) => {
    const response = await groupCollection.find({
      group_name : group_name
    }).toArray();
    if(response.length > 0)
        return true
    else
        return false
  };

/**
 * Add a new group to the Database
 * @param {String} group_name Name of the new group
 * @param {String} group_description Description of the group
 * @returns The _id of the added data
 */
const create_group = async (group_name, group_description) => {
  const response = await groupCollection.insertOne({
    group_name, group_description
  });
  return response;
};


/**
 * Get all group details from the database
 * @returns The group details
 */
const get_groups = async () => {
  const response = await groupCollection.find().toArray();
  return response;
};

// Export the functions
module.exports = {
  create_group,
  get_groups,
  is_exist
};
