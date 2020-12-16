const { layout } = require('../utils')
const { Todo } = require('../models');

const showForm = (req, res) => {
    res.render('todos/form', {
        locals: {
            title: 'Add new post'
        },
        ...layout
    });
};

const processForm = async (req, res) => {
    const { title } = req.body;
    const { id } = req.session.user;
    
    if (title && id) {
        const newTodo = await Todo.create({
            title,
            isComplete: false,
            userId: id
        });
        console.log(newTodo);
        res.redirect(`${req.baseUrl}/`)
    } else {
        res.redirect(req.url);
    }
    
};

const list = async (req, res) => {
    const { id } = req.session.user;
    if (id) {
        // Show this user's Todos
        const todos = await Todo.findAll({
            where: {
                userId: id // match the logged in user
            }
        });
        res.render('todos/list', {
            locals: {
                todos
            },
            ...layout
        })
    } else {
        // redirect
        res.redirect('/');
    }
};

module.exports = {
    showForm,
    processForm,
    list
};
