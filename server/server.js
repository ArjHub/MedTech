const express  = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

//middleware

app.use(express.json());
app.use(cors(
  {
    origin: '*',
  }
));

app.post('/adduser', (req, res) => {
    const {walletAddr, password, designation} = req.body; 
    console.log(req.body);
    res.send("WalletAddr " + walletAddr + " password " + password + " designation " + designation);
    const insert_qry = `insert into accounts (walletaddr , password, designation) values('${walletAddr}', '${password}', '${designation}');`;
    
    pool.query(insert_qry).then((Response) => {
        console.log("User added successfully");
        console.log(Response);
    })
    .catch((err)=> {
        console.log(err);
    });
});
app.post('/login', async (req, res) => {
    const { walletAddr, password } = req.body;
  
    try {
      const user = await pool.query(
        `SELECT * FROM accounts WHERE walletaddr = $1 AND password = $2`,
        [walletAddr, password]
      );
    //console.log(user.rows);
    if (user.rows.length > 0) {
      const designation = user.rows[0].designation;
      res.json({ success: true, designation });
  } else {
      res.json({ success: false });
  }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  });

app.listen(3001, () => {
    console.log("server is running on port 3001");
});