import express from 'express'
// import db from '../db.js'
import prisma from '../prismaClient.js'

const router = express.Router()

router.get('/', async (req, res) => {
    // const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    // const todos = getTodos.all(req.userId)

    const todos = await prisma.todos.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

// Create a new todo
router.post('/', async (req, res) => {
    const { task } = req.body

    const todo = await prisma.todos.create({
        data: {
            task,
            userId: req.userId
        }
    })

    res.json(todo)
})

router.put('/:id', async (req,res)=>{
    const {completed } = req.body
    const { id } = req.params
    
    const updatedTodo = await prisma.todos.update({
        where:{
            id: parseInt(id),
            userId: req.userId
        },
        data:{
            completed: !!completed
        }
    })
    // const updatedTo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`)
    // updatedTo.run(completed, id)

    res.json(updatedTodo)
})

router.delete('/:id', async (req,res)=>{
    const {id} = req.params
    const userId= req.userId
    // const deleteTodo = db.prepare(`DELETE FROM todos WHERE id= ? AND user_id = ?`)
    await prisma.todos.delete({
        where:{
            id: parseInt(id),
            userId: userId
        }
    })
    res.json({message: "Todo Deleted"})
})

export default router