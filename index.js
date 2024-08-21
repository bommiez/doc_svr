const http = require('http');
const app = require('./app');
const db = require('./config/database');

const port = 3000;
app.listen(port , async()=>{
    await http.createServer(app);
    await db.sync();
    console.log(`server is running in port ${port}`)
})