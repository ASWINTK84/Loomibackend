
import  slugify  from "slugify";
import categoryModel from "../models/categoryModel.js";




export const createCategoryController = async (req , res)=> {

    try {

        const {name} = req.body ;
        if(!name){
            return res.status(401).send({message:"Name is required"})}
        const existingCategory = await categoryModel.findOne({name})
            if(existingCategory){
                return res.status(200).send({
                    success:true ,
                    message:'Category already exist'
                })
            }    

            const category = await new categoryModel({name ,  slug:slugify(name)}).save()
            res.status(201).send({
                success:true ,
                message:"new category created" ,
                category 
            })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false ,
            message:"error in category",
            error
        })
        
    }

};




// updateCategoryController

export const updateCategoryController = async(req , res)=>{

    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id , {name , slug:slugify(name)} , {new:true})
        res.status(200).send({
            success:true ,
            message:"category updated successfully",
            category ,
            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false ,
            error ,
            message:"Error while updating category"
        })
        
    }

}



//get all category

export const categoryController =  async(req , res )=>{
try {
     const category = await categoryModel.find({})
        res.status(200).send({
            success:true ,
            message:"All category list",
            category ,
            
        })
    
} catch (error) {
    console.log(error)
     res.status(500).send({
            success:false ,
            error ,
            message:"Error while setting all category"
        })
    
    
}
};

//single category controller


export const singleCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);  
    res.status(200).send({
      success: true,
      message: "Successfully fetched single category",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching single category",
      error,
    });
  }
};


// delete category

export const deleteCategoryController = async (req , res) =>{
    try {
      const   {id} = req.params
     const category =     await categoryModel.findByIdAndDelete(id)
         res.status(200).send({
            success:true ,
            message:" successfully deleted  category",
            category ,
            
        })
    } catch (error) {
          console.log(error)
     res.status(500).send({
            success:false ,
            error ,
            message:"Error while deleting category"
        })
    }
}


