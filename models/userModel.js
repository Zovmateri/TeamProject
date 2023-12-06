const sql = require('mssql/msnodesqlv8')
const bcrypt = require('bcrypt')
const config = require('../config')

async function connect() {
    return await sql.connect(config.db)
}

async function registerUser(login, name, surname, password, email) {
    const connection = await connect()
    const hashedPassword = await bcrypt.hash(password, 10)
    const registerDate = new Date()

    // Assuming your tables are named Пользователь and Личные данные
    try {
        if(IsLoginUnique(login) == true) {
            const request = connection.request();

        // Prepare the first statement and execute it
        const result1 = await request
            .input('name', sql.NVarChar, name)
            .input('surname', sql.NVarChar, surname)
            .query(`
                INSERT INTO [dbo].Пользователь (Имя, Фамилия, [режим Веган], [Статус])
                VALUES (@name, @surname, 0, 0);

                SELECT SCOPE_IDENTITY() AS userId;
            `)

        // Get the userId from the result of the first insert
        const userId = result1.recordset[0].userId
        // Prepare the second statement and execute it
        const result2 = await connection
            .request()
            .input('userId', sql.Int, userId)
            .input('login', sql.VarChar,login)
            .input('email', sql.VarChar, email)
            .input('registrationDate', sql.Date, registerDate)
            .input('HashedPassword', sql.NVarChar, hashedPassword)
            .query(`
                INSERT INTO [dbo].[Личные данные] ([ID Пользователя], [Логин], [Электронная почта], [Дата регистрации], [Тип владельца данных], [Хэш пароля]) VALUES (@userId, @login, @email, @registrationDate, 1, @HashedPassword);
            `)
            return true
        }
        return false
    } catch (error) {
        throw error;
    } finally {
        // Close the connection
        await connection.close();
    }
}
async function CheckCredentials(login, password) {
    const connection = await connect()
    try {
        const result = await connection
        .request()
        .input('login',sql.VarChar,login)
        .query('SELECT [Хэш пароля] as hashed FROM [dbo].[Личные данные] WHERE Логин = @login')
    
        if (result.recordset.length === 0) {
            return false
        }
        const hashedPassword = result.recordset[0].hashed
        const passwordMatch = await bcrypt.compare(String(password),String(hashedPassword))
        return passwordMatch
    } catch (error) {
        throw error
    } finally { 
        await connection.close()
    }
    
}
async function IsLoginUnique(login) {
    const connection = await connect()
    try {
        const result = await connection
        .request()
        .input('login',sql.VarChar,login)
        .query('select count(*) from [dbo].[Личные данные] where Логин = @login')
        
        if (result.recordset.length > 0) {
            return false
        }
        return true
    } catch (error) {
        throw error
    } finally {
        await connection.close()
    }
}
async function emptyInput(login,name,surname,password,email) {
    const errors = []
    if(!login) {
        errors.push('Логин обязателен')
    }
    if(!name) {
        errors.push('Имя обязательно')
    }
    if(!surname) {
        errors.push('Фамилия обязательна')
    }
    if(!password) {
        errors.push('Пароль обязателен')
    }
    if(!email) {
        errors.push('Email обязателен')
    }
    return errors
}
module.exports = {registerUser,CheckCredentials,IsLoginUnique,emptyInput,connect}