const sql = require('mssql/msnodesqlv8')
const config = require('../config')

async function connect() {
    return await sql.connect(config.db)
}

async function GetAvailableIngredients(login) {
    const connection = await connect()
    const hashedPassword = await bcrypt.hash(password, 10)
    const registerDate = new Date()

    // Assuming your tables are named Пользователь and Личные данные
    try {
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
    } catch (error) {
        throw error;
    } finally {
        // Close the connection
        await connection.close();
    }
}
module.exports = {registerUser,CheckCredentials,IsLoginUnique,emptyInput,connect}