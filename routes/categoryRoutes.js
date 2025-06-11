import  express  from "express";
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controller/categoryController.js";


const  router = express.Router()




//routes 
// Create category
router.post('/create-category' , createCategoryController)


// Update category

router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)


// get all category

router.get('/get-category' , categoryController )

// single category

router.get('/single-category/:id', singleCategoryController);



// delete category

router.delete('/delete-category/:id',requireSignIn, isAdmin, deleteCategoryController)







export default router