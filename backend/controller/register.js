const bcrypt = require("bcryptjs");

const db = require("../util/DB");
const loginController = require("../controller/login");
const {validationResult} = require("express-validator");

/**
 * Function registers new user to the user table.
 * It requires username and password fields in the request body: {username: "user login", password: "user password"}.
 * All fields must be string-type.
 * Function also prints helpful hints to server console in case of problems.
 * @param req {object} request object from the previous function
 * @param res {object} response object from the previous function
 * @param next {function} next function
 */
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        try {
            const {username, password} = req.body;

            const selectUsernameQ = `SELECT username
                                     FROM user
                                     WHERE username = ?`;
            const resp = await db.makeQuery(selectUsernameQ, username);
            const isUserExist = resp.length !== 0;

            if (!isUserExist) {
                const hashedPassword = await bcrypt.hash(password, 8);
                const insertUserQ = `INSERT INTO user (username, password)
                                     VALUES (?, ?)`;
                await db.makeQuery(insertUserQ, [username, hashedPassword]);
                res.status(200);
                res.isSuccess = true;
            } else {
                res.status(500);
                res.isSuccess = false;
            }
        } catch (e) {
            console.log('No connection to the DB or problems with query');
            res.isSuccess = false;
        }
    }

    next();
}

/**
 * The function delete a user account with all data related to it.
 * The function requires jwt cookie (=user is logged in), and request body with the following data: {username: "user login", password: "user password"}.
 * @param req {object} request object
 * @param res {object} response object
 * @param next {function} next function
 */
exports.deleteUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        try {
            const usernameCookie = req.username;
            const {username, password} = req.body;

            if (usernameCookie != null && username != null && password != null && username === usernameCookie) {
                const selectUserQ = `SELECT * FROM user WHERE username = ?`;
                const selectUserResp = await db.makeQuery(selectUserQ, username);
                const isUserExist = selectUserResp.length !== 0;

                if (isUserExist) {
                    if (await bcrypt.compare(password, selectUserResp[0].password)) {
                        const deleteJWTQ = `DELETE FROM JWT WHERE username = ?`;
                        await db.makeQuery(deleteJWTQ, username);

                        const deleteUserAllowedQ = `DELETE FROM UserAllowed WHERE username = ?`;
                        await db.makeQuery(deleteUserAllowedQ, username);

                        const deleteAccessRequestQ = `DELETE FROM AccessRequest WHERE sender = ? OR receiver = ?`;
                        await db.makeQuery(deleteAccessRequestQ, [username, username]);

                        const userTablesQ = `SELECT * FROM UserDatabase WHERE username = ?`;
                        const userTablesResp = await db.makeQuery(userTablesQ, username);
                        if (userTablesResp != null && userTablesResp.length > 0) {
                            for (let i = 0; i < userTablesResp.length; i++) {
                                const name = userTablesResp[i].name;
                                const tableName = username + '_' + name;

                                const tableDropQ = `DROP TABLE IF EXISTS ${tableName}`;
                                const tableDropResp = await db.makeQuery(tableDropQ, tableName);
                                if (tableDropResp) {
                                    const deleteAllUserAllowedQ = `DELETE FROM UserAllowed WHERE id = ?`;
                                    await db.makeQuery(deleteAllUserAllowedQ, userTablesResp[i].id);

                                    const deleteUserDatabaseQ = `DELETE FROM UserDatabase WHERE name = ?`;
                                    await db.makeQuery(deleteUserDatabaseQ, name);
                                }
                            }
                        }

                        const deleteUserQ = `DELETE FROM User WHERE username = ?`;
                        await db.makeQuery(deleteUserQ, username);

                        await loginController.logout(req, res, next);
                    }
                } else {
                    res.status(500);
                    res.isSuccess = false;
                }
            }
        } catch (e) {
            console.log('No connection to the DB or problems with query');
            res.isSuccess = false;
        }
    }

    next();
}