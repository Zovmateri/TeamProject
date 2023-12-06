const userModel = require('../models/userModel')

exports.getRegister = (req,res) => {
    res.render('register')
}
exports.postRegister = async (req, res) => {
    const { login, name, surname, password, email } = req.body

    try {
        const isEmptyInput = await userModel.emptyInput(login,name,surname,password,email)
        if(isEmptyInput.length > 0) {
            res.send(isEmptyInput.join('<br>'))
            return
        }
        const IsLoginUnique = await userModel.IsLoginUnique(login)
        if (!IsLoginUnique) {
            res.status(401).send('Этот логин уже существует, попробуйте другой логин!')
            return
        }
        const registraionSuccess = await userModel.registerUser(login, name, surname, password, email)
        if(registraionSuccess) {
            res.render('login')
        } else {
            res.send('Ошибка в регистрации')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error registering user')
    }
}
exports.getLogin = (req,res) => {
    res.render('login')
}
exports.postLogin = async (req,res) => {
    const {username,password} = req.body

    try {
        if(!username || !password) {
            res.status(401).send('Пожалуйста, введите логин и пароль.')
            return
        }
        const isValidCredentials = await userModel.CheckCredentials(username,password)
        if(!isValidCredentials) {
            res.status(401).send('Логин или пароль не верны!!')
            return
        }
        res.redirect('register')
    } catch (error){
        console.error(error)
        res.status(500).send('Ошибка в проверке данных.')
    }
}