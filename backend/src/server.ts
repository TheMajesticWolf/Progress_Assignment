import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './routes/db.routes.js'
import path from 'path'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
	origin: ["http://localhost:4200", "http://10.38.45.58:4200", "http://192.168.0.110:4200"],
}))

app.use('/uploads', express.static("uploads"));


const MONGO_URI = process.env?.MONGO_URI || "mongodb://localhost:27017/assignment-form"
const PORT = parseInt(process.env?.PORT || "6969")

mongoose.connect(MONGO_URI)
.then(() => {

	console.log(`Mongo connected successfully`)
	
	app.listen(PORT, "0.0.0.0", () => {
		console.log(`Server listening on port: ${PORT}`)
	})
})

.catch((err) => {
	console.log("An error occured")
})


// app.get("/", (req, res) => {
// 	res.send("<h1>Hello world</h1>")
// })

app.use("/api/db", router)
