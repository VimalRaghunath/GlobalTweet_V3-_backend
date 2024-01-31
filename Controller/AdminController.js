// const AdminSchema = require("../Model/AdminSchema")

const UserSchemaa = require("../Model/UserSchemaa");

module.exports = {

 //Admin signin [POST api/admin/]----------------



// Admin to get all users [GET api/admin/users]----------------

  getAllusers : async (req,res) => {
        try {
            const users = await UserSchemaa.find();
            res.json(users);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
      }
   },


// Admin to get all posts [GET api/admin/posts]-------------------


  getAllposts : async (req,res) => {
    try {
      const posts = await UserSchemaa.find();
      res.json(posts)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" })
    }
  },


// Delete all the users [DELETE api/admin/users/:id]----------------
    
    deleteUser : async (req,res) => {
          const userId = req.params.id;
      try {

        await UserSchemaa.findByIdandDelete(userId)
         res.json({ message: 'User deleted successfully' });

       } catch (error) {
           
         console.error(error);
         res.status(500).json({ error: 'Internal Server error' });
       }
   },
}