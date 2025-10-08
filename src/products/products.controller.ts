import ProductModel from './products.model'
import { Request, Response } from 'express'
import Exc from "../utill/exc.utill"


export const fetchProduct = Exc(async (req: Request, res: Response) => {
    const products = await ProductModel.find()
    res.json(products)
})


export const createProduct = Exc(async (req: Request, res: Response) => {
    const product = new ProductModel(req.body)
    await product.save()
    res.json(product)
})


export const updateProduct= Exc(async (req: Request, res: Response)=>{
	const {fieldType} = req.query
	console.log(req.query)

	const {id} = req.params
	let body = req.body
    console.log(fieldType,id,body)
	if(fieldType && fieldType === "array")
		body = {$push: req.body}

	const ebook = await ProductModel.findByIdAndUpdate(id, body, {new: true})

	if(!ebook)
		return res.status(404).json({message: 'Ebook not found'})
    
	console.log(ebook)
	res.json(ebook)

})

export const deleteProduct = Exc(async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id)
        return res.status(404).json({ message: 'Product not found' })

    const product = await ProductModel.findByIdAndDelete(id)
    res.json(product)
})
