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
import events from 'events';

const emitter = new events.EventEmitter();

const checkAuthorization = (req, res, next) => {
  if (req.headers.authorization !== process.env.API_KEY && !req.originalUrl.includes('connect-sse')) {
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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://dashboard.lttrbx.link');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

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

app.delete('/blacklist', async (req, res) => {
  const recordId = req.body.id;

  const currentRecord = await Blacklist.findByPk(recordId);

  if (!currentRecord) {
    res.sendStatus(404);
  }

  await Blacklist.destroy({
    where: {
      id: recordId
    }
  });

  res.sendStatus(204);
});

app.get('/branches', async (req, res) => {
  const branches = await Branch.findAll();
  res.send(branches);
});

app.get('/feedback', async (req, res) => {
  const feedback = await Feedback.findAll();
  res.send(feedback);
});

app.post('/feedback', async (req, res) => {
  const newfeedback = req.body;

  const createdfeedback = await Feedback.create(newfeedback);

  emitter.emit('feedbackAdd', createdfeedback.dataValues);

  res.sendStatus(201);
});

app.get('/nps', async (req, res) => {
  const nps = await NPS.findAll();
  res.send(nps);
});

app.post('/nps', async (req, res) => {
  const newNPS = req.body;

  const createdNPS = await NPS.create(newNPS);

  emitter.emit('npsAdd', createdNPS.dataValues);

  res.sendStatus(201);
});

app.get('/nps-connect-sse', async (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  const npsUpdateCB = (nps) => {
    res.write(`event: update\ndata: ${JSON.stringify(nps)} \n\n`);
  };

  const npsAddCB = (nps) => {
    res.write(`event: add\ndata: ${JSON.stringify(nps)} \n\n`);
  };

  emitter.on('npsDataChanged', npsUpdateCB);

  emitter.on('npsAdd', npsAddCB);

  res.on('close', () => {
    emitter.off('npsDataChanged', npsUpdateCB);
    emitter.off('npsAdd', npsAddCB);
  });
});

app.get('/feedback-connect-sse', async (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  const feedbackUpdateCB = (feedback) => {
    res.write(`event: update\ndata: ${JSON.stringify(feedback)} \n\n`);
  };

  const feedbackAddCB = (feedback) => {
    res.write(`event: add\ndata: ${JSON.stringify(feedback)} \n\n`);
  };

  emitter.on('feedbackDataChanged', feedbackUpdateCB);

  emitter.on('feedbackAdd', feedbackAddCB);

  res.on('close', () => {
    emitter.off('feedbackDataChanged', feedbackUpdateCB);
    emitter.off('feedbackAdd', feedbackAddCB);
  });
});

app.get('/userStatus-connect-sse', async (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  const userStatusUpdateCB = (userStatus) => {
    res.write(`event: update\ndata: ${JSON.stringify(userStatus)} \n\n`);
  };

  const userStatusAddCB = (userStatus) => {
    res.write(`event: add\ndata: ${JSON.stringify(userStatus)} \n\n`);
  };

  const userStatusUpdateSecondNameCB = (userStatus) => {
    res.write(`event: updateSecondName\ndata: ${JSON.stringify(userStatus)} \n\n`);
  };

  const userStatusUpdateInformationCB = (userStatus) => {
    res.write(`event: updateInformation\ndata: ${JSON.stringify(userStatus)} \n\n`);
  };

  emitter.on('userStatusDataChanged', userStatusUpdateCB);

  emitter.on('userStatusAdd', userStatusAddCB);

  emitter.on('userStatusUpdateSecondName', userStatusUpdateSecondNameCB);
  
  emitter.on('userStatusUpdateInformation', userStatusUpdateInformationCB);

  res.on('close', () => {
    emitter.off('userStatusDataChanged', userStatusUpdateCB);
    emitter.off('userStatusAdd', userStatusAddCB);
    emitter.off('userStatusUpdateSecondName', userStatusUpdateSecondNameCB);
    emitter.off('userStatusUpdateInformation', userStatusUpdateInformationCB);
  });
});

app.patch('/npsUpdateStatus', async (req, res) => {
  const { id, status } = req.body;

  const currentRecord = await NPS.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.status = status;

  await currentRecord.save();

  emitter.emit('npsDataChanged', currentRecord);

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

  emitter.emit('npsDataChanged', currentRecord);

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

  const whereClause = {
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
    }
  };

  if (favouriteCurrenciesBuy.length) {
    whereClause.favouriteCurrencyGive = {
      [Op.in]: favouriteCurrenciesBuy.length ? favouriteCurrenciesBuy : allCurrencies
    }
  }

  if (favouriteCurrenciesSell.length) {
    whereClause.favouriteCurrencyReceive = {
      [Op.in]: favouriteCurrenciesSell.length ? favouriteCurrenciesSell : allCurrencies
    }
  }
  
  let foundUsers = await User.findAll({
    where: whereClause
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

    const branchCondition = branch.length ? { [Op.in]: branch } : { [Op.not]: null }

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
      includeUsersWithoutFirstName,
      includeUsersWithoutLastName,
      includeUsersWithoutBirthDate,
      includeUsersWithoutSex,
      includeUsersWithoutEmail,
    } = exactUser;

    if (firstName) {
      foundUsers = foundUsers.filter(user => user.firstName === firstName);
    }

    if (includeUsersWithoutFirstName.length && includeUsersWithoutFirstName.length !== 2) {
      if (includeUsersWithoutFirstName.includes('defined')) {
        foundUsers = foundUsers.filter(user => user.firstName);
      }

      if (includeUsersWithoutFirstName.includes('undefined')) {
        foundUsers = foundUsers.filter(user => !user.firstName);
      }
    }

    if (lastName) {
      foundUsers = foundUsers.filter(user => user.lastName === lastName);
    }

    if (includeUsersWithoutLastName.length && includeUsersWithoutLastName.length !== 2) {
      if (includeUsersWithoutLastName.includes('defined')) {
        foundUsers = foundUsers.filter(user => user.lastName);
      }

      if (includeUsersWithoutLastName.includes('undefined')) {
        foundUsers = foundUsers.filter(user => !user.lastName);
      }
    }

    console.log(foundUsers);

    if (sex.length && sex.length !== 3) {
      foundUsers = foundUsers.filter(user => sex.includes(user.sex));
    }

    console.log(foundUsers);
     
    if (includeUsersWithoutSex.length && includeUsersWithoutSex.length !== 2) {
      if (includeUsersWithoutSex.includes('defined')) {
        foundUsers = foundUsers.filter(user => user.sex);
      }

      if (includeUsersWithoutSex.includes('undefined')) {
        foundUsers = foundUsers.filter(user => !user.sex);
      }
    }

    if (email) {
      foundUsers = foundUsers.filter(user => user.email === email);
    }
 
    if (includeUsersWithoutEmail.length && includeUsersWithoutEmail.length !== 2) {
      if (includeUsersWithoutEmail.includes('defined')) {
        foundUsers = foundUsers.filter(user => user.email);
      }

      if (includeUsersWithoutEmail.includes('undefined')) {
        foundUsers = foundUsers.filter(user => !user.email);
      }
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
    
    if (includeUsersWithoutBirthDate.length && includeUsersWithoutBirthDate.length !== 2) {
      if (includeUsersWithoutBirthDate.includes('defined')) {
        foundUsers = foundUsers.filter(user => user.birthDate);
      }

      if (includeUsersWithoutBirthDate.includes('undefined')) {
        foundUsers = foundUsers.filter(user => !user.birthDate);
      }
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

app.post('/userStatuses', async (req, res) => {
  const userStatus = req.body;

  const createduserStatus = await UserStatus.create(userStatus);

  emitter.emit('userStatusAdd', createduserStatus.dataValues);

  res.sendStatus(201);
});

app.patch('/feedbackUpdateStatus', async (req, res) => {
  const { id, status } = req.body;

  const currentRecord = await Feedback.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.status = status;

  await currentRecord.save();

  emitter.emit('feedbackDataChanged', currentRecord);

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

  emitter.emit('feedbackDataChanged', currentRecord);

  res.sendStatus(204);
});

app.patch('/userStatusUpdateSecondName', async (req, res) => {
  const { id, secondName } = req.body;

  const currentRecord = await UserStatus.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.operatorSecondName = secondName;

  await currentRecord.save();

  emitter.emit('userStatusUpdateSecondName', currentRecord);

  res.sendStatus(204);
});

app.patch('/userStatusUpdateInformation', async (req, res) => {
  const { id, information } = req.body;

  const currentRecord = await UserStatus.findByPk(id);

  if (!currentRecord) {
    res.sendStatus(404)
  }

  currentRecord.information = information;

  await currentRecord.save();

  emitter.emit('userStatusUpdateInformation', currentRecord);

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

  emitter.emit('userStatusDataChanged', currentRecord);

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

  emitter.emit('userStatusDataChanged', currentRecord);

  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`app is listening on port - ${port}`)
});