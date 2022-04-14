
const router = require('express').Router();
const GroupController = require('../controller/group');


// API End point for creating a new group
router.post("/create_group", async (req, res) => {
    const { group_name, group_description } = req.body;
    console.log(group_name, group_description)
    try{
        // Check if group exists
        const group_exist = await GroupController.is_exist(group_name)
        if(group_exist==false) {
            // Create a new group in DB
            await GroupController.create_group(group_name, group_description)

            return res.status(200).json({
              success: true,
              data: "group created successfully",
            });
        }
        else{
          return res.status(200).json({
              success: true,
              data: "group name already exists",
            });
        }
    } catch (error) {
      // Error
      return res.status(500).json({
        success: false,
        data: `Error in creating group :: ${error.message}`,
      });
    }
  });


// API End point to get group details
router.get("/get_groups", async (req, res) => {
    try {
      // Get the group details
      data = await GroupController.get_groups();
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      // Error
      return res.status(500).json({
        success: false,
        data: `Error in retriving the data :: ${error.message}`,
      });
    }
  });

module.exports = router;