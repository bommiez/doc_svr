

const logout = async (req,res) =>{
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
}
module.exports = {logout}