import express from "express";
import cors from 'cors';
import Promo from "./db/models/promo.js";
import Role from "./db/models/role.js";
import Staff from "./db/models/staff.js";
import Branch from "./db/models/branch.js";
import Blacklist from "./db/models/blacklist.js";
import Balance from "./db/models/balance.js";
import Feedback from "./db/models/feedback.js";
import NPS from "./db/models/nps.js";
import Order from "./db/models/order.js";
import Rate from "./db/models/rate.js";
import Segment from "./db/models/segment.js";
import User from "./db/models/user.js";
import UserStatus from "./db/models/userStatus.js";
import dotenv from 'dotenv';

const checkAuthorization = (req, res, next) => {
  if (req.headers.authorization !== process.env.API_KEY) {
    res.sendStatus(401);
    return;
  }

  next();
};

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(checkAuthorization);

app.get('/', (req, res) => {
  res.send('you can receive some info for personal cabinets');
});

app.get('/balances', async (req, res) => {
  const balances = await Balance.findAll();
  res.send(balances);
});

app.get('/blacklist', async (req, res) => {
  const blacklist = await Blacklist.findAll();
  res.send(blacklist);
});

app.get('/branches', async (req, res) => {
  const branches = await Branch.findAll();
  res.send(branches);
});

app.get('/feedback', async (req, res) => {
  const feedback = await Feedback.findAll();
  res.send(feedback);
});

app.get('/nps', async (req, res) => {
  const nps = await NPS.findAll();
  res.send(nps);
});

app.get('/orders', async (req, res) => {
  const orders = await Order.findAll();
  res.send(orders);
});

app.get('/promos', async (req, res) => {
  const promos = await Promo.findAll();
  res.send(promos);
});

app.post('/promos', async (req, res) => {
  const promo = req.body;

  await Promo.create(promo);

  res.send(promo);
})

app.delete('/promos', async (req, res) => {
  const promoId = req.body.id;

  await Promo.destroy({
    where: {
      id: promoId
    }
  });

  res.sendStatus(204);
});

app.get('/rates', async (req, res) => {
  const rates = await Rate.findAll();
  res.send(rates);
});

app.get('/roles', async (req, res) => {
  const roles = await Role.findAll();
  res.send(roles);
});

app.get('/segments', async (req, res) => {
  const segments = await Segment.findAll();
  res.send(segments);
});

app.get('/staff', async (req, res) => {
  const staff = await Staff.findAll();
  res.send(staff);
});

app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.send(users);
});

app.get('/userStatuses', async (req, res) => {
  const userStatuses = await UserStatus.findAll();
  res.send(userStatuses);
});

app.listen(port, () => {
  console.log(`app is listening on port - ${port}`)
})