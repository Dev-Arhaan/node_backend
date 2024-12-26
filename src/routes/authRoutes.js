import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body
    
    try {
        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });
        
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 8)
        
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        await prisma.todoss.create({
            data: {
                task: `Hello :) Add your first todo!`,
                userId: user.id
            }
        })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.error('Registration error:', err);
        
        // Send more specific error responses
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        res.status(500).json({ error: 'Server error during registration' });
    }
})

router.post('/login', async (req, res) => {
    // we get their email, and we look up the password associated with that email in the database
    // but we get it back and see it's encrypted, which means that we cannot compare it to the one the user just used trying to login
    // so what we can to do, is again, one way encrypt the password the user just entered

    const { username, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        // if we cannot find a user associated with that username, return out from the function
        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        // if the password does not match, return out of the function
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        console.log(user)

        // then we have a successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})


export default router