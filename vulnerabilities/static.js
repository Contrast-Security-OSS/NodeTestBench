/* eslint-disable no-unused-vars */
/* hardcoded-password should trigger on lines 4, 7, 10, 11, 14, 16 */

const variabledec_password = 'wubalubadubdub';
// AssignmentExpression
let assignment_password = '';
assignment_password = 'wubalubadubdub';
// AssignmentExpression with ObjectExpression
const conf = {};
conf.password = 'wubalubadubdub';
conf['passwd'] = 'wubalubadubdub';
// ObjectExpression
const config = {
  password: 'wubalubadubdub',
  // with Property literal
  passwd: 'wubalubadubdub'
};

/* hardcoded-key  should trigger on lines 22, 25, 28, 29, 32, 34 */

// VariableDeclarator
const variabledec_des = 'wubalubadubdub';
// AssignmentExpression
let assignment_aes = '';
assignment_aes = 'wubalubadubdub';
// AssignmentExpression with ObjectExpression
const keyConf = {};
keyConf.blowfish = 'wubalubadubdub';
keyConf['iv'] = 'wubalubadubdub';
// ObjectExpression
const keyConfig = {
  secret: 'wubalubadubdub',
  // with Property literal
  iv: 'wubalubadubdub'
};

/* NOTE: do not change above this line. There are agent tests that rely on the line numbers different things occur on */
