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
import { Op } from "sequelize";

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

app.post('/blacklist', async (req, res) => {
  const { phoneNumber, reason } = req.body;

  const isNumberExist = await Blacklist.findAll({
    where: {
      phoneNumber: {
        [Op.eq]: phoneNumber
      }
    }
  });

  if (isNumberExist.length) {
    res.sendStatus(409);
  }

  await Blacklist.create({
    phoneNumber,
    reason
  });

  res.sendStatus(201);
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

app.patch('/npsUpdateStatus', async (req, res) => {
  const { id, status } = req.body;

  const currentRecord = await NPS.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.status = status;

  await currentRecord.save();

  res.sendStatus(204);
});

app.patch('/npsUpdateCommentary', async (req, res) => {
  const { id, commentary } = req.body;

  const currentRecord = await NPS.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.commentary = commentary;

  await currentRecord.save();

  res.sendStatus(204);
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

  const currentPromo = await Promo.findByPk(promoId);

  if (!currentPromo) {
    res.sendStatus(404);
  }

  const users = await User.findAll({
    where: {
      allowedPromos: {
        [Op.contains]: [currentPromo.code]
      }
    }
  });

  for (const user of users) {
    user.allowedPromos = user.allowedPromos.filter(promo => promo !== currentPromo.code);

    await user.save();
  }

  await Promo.destroy({
    where: {
      id: promoId
    }
  });

  res.sendStatus(204);
});

app.patch('/promos', async (req, res) => {
  const editingInfo = req.body;

  const currentPromo = await Promo.findByPk(editingInfo.id);

  if (!currentPromo) {
    res.sendStatus(404);

    return;
  }

  const updatingObject = {};

  for (const key in editingInfo) {
    if (key !== 'id' && editingInfo[key] !== undefined) {
      updatingObject[key] = editingInfo[key];
    }
  }

  await currentPromo.update(updatingObject);

  res.send(currentPromo);
});

app.post('/promosBroadcast', async(req, res) => {
  const {
    totalOrdersFrom,
    totalOrdersTo,
    successOrdersFrom,
    successOrdersTo,
    failOrdersFrom,
    failOrdersTo,
    totalOrdersSumFrom,
    totalOrdersSumTo,
    successOrdersSumFrom,
    successOrdersSumTo,
    failOrdersSumFrom,
    failOrdersSumTo,
    favouriteCurrenciesBuy,
    favouriteCurrenciesSell,
    exactOrderFlag,
    exactOrder,
    exactUserFlag,
    exactUser,
    promoCodes
  } = req.body;

  const allCurrencies = ["USD", "UAH", "EUR", "GBP", "CHF", "PLN"];
  
  let foundUsers = await User.findAll({
    where: {
      totalOrders: {
        [Op.between]: [totalOrdersFrom, totalOrdersTo]
      },
      successOrders: {
        [Op.between]: [successOrdersFrom, successOrdersTo]
      },
      failOrders: {
        [Op.between]: [failOrdersFrom, failOrdersTo]
      },
      totalOrdersSum: {
        [Op.between]: [totalOrdersSumFrom, totalOrdersSumTo]
      },
      successOrdersSum: {
        [Op.between]: [successOrdersSumFrom, successOrdersSumTo]
      },
      failOrdersSum: {
        [Op.between]: [failOrdersSumFrom, failOrdersSumTo]
      },
      favouriteCurrencyGive: {
        [Op.in]: favouriteCurrenciesBuy.length ? favouriteCurrenciesBuy : allCurrencies
      },
      favouriteCurrencyReceive: {
        [Op.in]: favouriteCurrenciesSell.length ? favouriteCurrenciesSell : allCurrencies
      },
    }
  });

  if (exactOrderFlag) {
    const {
      timeFrom,
      timeTo,
      dateFrom,
      dateTo,
      branch,
      clientGaveFrom,
      clientGaveTo,
      currencyBuy,
      clientReceivedFrom,
      clientReceivedTo,
      currencySell,
      blueDollars
    } = exactOrder;

    const splittedDateFrom = dateFrom ? dateFrom.split('-') : ['0000', '00', '00'];
    const splittedDateTo = dateTo ? dateTo.split('-') : ['9999', '00', '00'];
    const splittedTimeFrom = timeFrom ? timeFrom.split(':') : ['00', '00'];
    const splittedTimeTo = timeTo ? timeTo.split(':') : [23, 59];

    const consolidatedTimeFrom = new Date(
      +splittedDateFrom[0],
      +splittedDateFrom[1] - 1,
      +splittedDateFrom[2],
      +splittedTimeFrom[0],
      +splittedTimeFrom[1],
    );

    const consolidatedTimeTo = new Date(
      +splittedDateTo[0],
      +splittedDateTo[1] - 1,
      +splittedDateTo[2],
      +splittedTimeTo[0],
      +splittedTimeTo[1],
    );

    const dateToComparingFrom = consolidatedTimeFrom.toISOString();
    const dateToComparingTo = consolidatedTimeTo.toISOString();

    const branchCondition = branch ? { [Op.eq]: branch } : { [Op.not]: null }

    const orders = await Order.findAll({
      where: {
        clientGiveAmount: {
          [Op.between]: [clientGaveFrom, clientGaveTo]
        },
        clientGiveCurrency: {
          [Op.in]: currencyBuy.length ? currencyBuy : allCurrencies
        },
        clientReceiveAmount: {
          [Op.between]: [clientReceivedFrom, clientReceivedTo]
        },
        clientReceiveCurrency: {
          [Op.in]: currencySell.length ? currencySell : allCurrencies
        },
        branchId: branchCondition,
        blueDollars: {
          [Op.eq]: blueDollars
        },
        createdAt: {
          [Op.between]: [dateToComparingFrom, dateToComparingTo],
        },
      }
    });
  
    foundUsers = foundUsers.filter(user => {
      return orders.some(order => user.id === order.userId)
    });
  }

  if (exactUserFlag) {
    const {
      firstName,
      lastName,
      birthDateFrom,
      birthDateTo,
      sex,
      email,
      phoneNumber,
    } = exactUser;

    if (firstName) {
      foundUsers = foundUsers.filter(user => user.firstName === firstName);
    }

    if (lastName) {
      foundUsers = foundUsers.filter(user => user.lastName === lastName);
    }

    if (sex.length) {
      foundUsers = foundUsers.filter(user => sex.includes(user.sex));
    }

    if (email) {
      foundUsers = foundUsers.filter(user => user.email === email);
    }

    if (phoneNumber) {
      foundUsers = foundUsers.filter(user => user.phoneNumber === phoneNumber);
    }

    if (birthDateFrom) {
      foundUsers = foundUsers.filter(user => user.birthDate >= birthDateFrom);
    }

    if (birthDateTo) {
      foundUsers = foundUsers.filter(user => user.birthDate <= birthDateTo);
    }
  }

  for (const user of foundUsers) {
    user.allowedPromos = [...user.allowedPromos, ...promoCodes];

    await user.save();
  }

  res.send(foundUsers);
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
  User.hasMany(Order, { foreignKey: 'userId' });
  User.hasMany(Feedback, { foreignKey: 'userId' });
  User.hasMany(NPS, { foreignKey: 'userId' });
  User.hasMany(UserStatus, { foreignKey: 'userId' });

  await User.sync()

  const users = await User.findAll({
    include: {
      all: true
    }
  });
  
  res.send(users);
});

app.get('/userStatuses', async (req, res) => {
  const userStatuses = await UserStatus.findAll();
  res.send(userStatuses);
});

app.patch('/feedbackUpdateStatus', async (req, res) => {
  const { id, status } = req.body;

  const currentRecord = await Feedback.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.status = status;

  await currentRecord.save();

  res.sendStatus(204);
});

app.patch('/feedbackUpdatecommentary', async (req, res) => {
  const { id, commentary } = req.body;

  const currentRecord = await Feedback.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.commentary = commentary;

  await currentRecord.save();

  res.sendStatus(204);
});

app.patch('/userStatusUpdateStatus', async (req, res) => {
  const { id, recordStatus } = req.body;

  const currentRecord = await UserStatus.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.recordStatus = recordStatus;

  await currentRecord.save();

  res.sendStatus(204);
});

app.patch('/userStatusesUpdateCommentary', async (req, res) => {
  const { id, commentary } = req.body;

  const currentRecord = await UserStatus.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.commentary = commentary;

  await currentRecord.save();

  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`app is listening on port - ${port}`)
})