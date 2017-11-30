/* hardcoded-password should trigger on lines 4, 7, 10, 11, 14, 16 */

// VariableDeclarator
var variabledec_password = 'wubalubadubdub';
// AssignmentExpression
var assignment_password = '';
assignment_password = 'wubalubadubdub';
// AssignmentExpression with ObjectExpression
var conf = {};
conf.password = 'wubalubadubdub'
conf['passwd'] = 'wubalubadubdub';
// ObjectExpression
var config = {
	password: 'wubalubadubdub',
	// with Property literal
	'passwd': 'wubalubadubdub'
}

/* hardcoded-key  should trigger on lines 22, 25, 28, 29, 32, 34 */

// VariableDeclarator
var variabledec_des = 'wubalubadubdub';
// AssignmentExpression
var assignment_aes = '';
assignment_aes = 'wubalubadubdub';
// AssignmentExpression with ObjectExpression
var conf = {};
conf.blowfish = 'wubalubadubdub'
conf['iv'] = 'wubalubadubdub';
// ObjectExpression
var config = {
	secret: 'wubalubadubdub',
	// with Property literal
	'iv': 'wubalubadubdub'
}

/* NOTE: do not change above this line. There are agent tests that rely on the line numbers different things occur on */
