import express from 'express'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5000

// Get the filename from the url of the current module
const __filename = fileURLToPath(import.meta.url)

// Get the directory name from the url
const __dirname = dirname(__filename)

//Middleware
app.use(express.json())

// Serves html file from public directory 
app.use(express.static(path.join(__dirname, '../public')))


// Routes

app.use('/auth', authRoutes)
app.use('/todos',authMiddleware, todoRoutes)

app.get('/', (req,res)=> {
    res.sendFile(path.join(__dirname, 'publc', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`server has started on port: ${PORT}`);    
    console.log(`http://localhost:${PORT}`);    
})