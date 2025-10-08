import { Router } from "express";
import { createProduct,fetchProduct,deleteProduct, updateProduct} from "./products.controller";
import { adminGuard } from "../middleware/guard.middleware";
const  ProductsRouter = Router()

ProductsRouter.get('/',fetchProduct)
ProductsRouter.post('/',adminGuard,createProduct)
ProductsRouter.delete('/:id',adminGuard,deleteProduct)
ProductsRouter.put('/:id',adminGuard,updateProduct)

export default ProductsRouter