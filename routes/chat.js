const router = require('express').Router();
const ChatController = require('../controller/chat');

// API endpoint to add a chat to the database
// router.post("/add_chat", async (req, res) => {
//   console.log("body")
//   console.log(req.body)
//   const { user_name, group_name, timestamp, message } = req.body;

//   // Check if required data is found
//   if (!user_name || !group_name || !timestamp || !message) {
//     return res.json({
//       success: false,
//       data: "Required data not found",
//     });
//   }

//   // Add the chat to database
//   try {
//     await ChatController.add_chat( user_name, group_name, timestamp, message
//     );
//     console.log("success")
//     return res.status(200).json({
//       success: true,
//       data: "chat added successfully",
//     });
//   } catch (error) {
//     // Error
//     return res.status(500).json({
//       success: false,
//       data: `Error in adding chat :: ${error.message}`,
//     });
//   }
// });

// API End point to get all chat data from database
router.get("/get_chats", async (req, res) => {
  console.log("HERE")
    try {
      group_name = req.query.group
      // Get the booking details
      data = await ChatController.get_chats(group_name);
      console.log(data)
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      // Error
      console.log(error.message)
      return res.status(500).json({
        success: false,
        data: `Error in retriving the data :: ${error.message}`,
      });
    }
  });

module.exports = router;