import { Router } from 'express';
import { dialogflow, Table } from 'actions-on-google';
import { EMTService } from '../services/emt.service';
import { Bus } from '../services/bus.model';

const app = dialogflow();
const router = Router();
const emt = new EMTService();

router.use(app);

app.intent('Next Bus', (conv, params: any) => {
  console.log('Next Bus');

  let stopId = getStopId(params);
  if (!stopId) return conv.ask('No he encontrado ninguna parada con ese nombre.');
  if (params.busId && !emt.isValidBus(params.busId)) return conv.ask('No existe ninguna bus con ese nombre.');

  return emt.getNextBuses(stopId, params.busId).then((buses: Bus[]) => {
    conv.ask(answerNextBus(buses, 0));
  })
});

app.intent('Next Bus - next', (conv) => {
  console.log('Next Bus - next');

  let context = (conv.contexts.get('nextbus-followup') as any).parameters;
  return emt.getNextBuses(context.place, context.busId).then((buses: Bus[]) => {
    conv.ask(answerNextBus(buses, 1));
  })
});

app.intent('Next Buses', (conv, params: any) => {
  console.log('Next Buses');

  let stopId = getStopId(params);
  if (!stopId) return conv.ask('No he encontrado ninguna parada con ese nombre.');

  return emt.getNextBuses(stopId).then((buses: Bus[]) => {
    let list: any = [];
    for (let bus of buses) {
      let row = [];
      row.push(bus.line);
      if (bus.min == 0) row.push('Próximo');
      else row.push(bus.min || bus.time);
      list.push(row);
    }
    conv.ask('Estos son los próximos buses');
    conv.ask(new Table({
      dividers: true,
      columns: ['Bus', 'Tiempo'],
      rows: list
    }));
  });
});

app.intent('My Balance', (conv, params: any) => {
  console.log('My Balance');
  
  let data: any = conv.data;
  const cardId = data.cardId || params.cardId;

  if (!cardId) return conv.ask('¿Cual es el número de tu tarjeta?');

  return emt.getbalance(params.cardId || cardId).then((balance) => {
    conv.ask(`Te quedan ${balance} viajes.`);
    if (!data.cardId) {
      conv.ask('Su número de tarjeta se guardará para no tener que repetirlo.');
      data.cardId = params.cardId;
    }
  }).catch(err => {
    conv.ask('Lo siento pero el número de tarjeta no es válido.');
  });
});

app.intent('My Balance - NumberNotExist', (conv, params: any) => {
  console.log('My Balance');
  
  let data: any = conv.data;
  const cardId = params.cardId;

  return emt.getbalance(cardId).then((balance) => {
    conv.ask(`Te quedan ${balance} viajes.`);
    conv.ask('Su número de tarjeta se guardará para no tener que repetirlo.');
    data.cardId = params.cardId;
  }).catch(err => {
    conv.ask('Lo siento pero el número de tarjeta no es válido.');
  });
});


function answerNextBus(buses: Bus[], index: number) {
  if (buses.length == 0) {
    return 'Lo siento, no hay buses disponibles en estos momentos.';
  } else if (buses[index].min == 0) {
    return `Esta apunto de llegar, el siguiente pasa en ${buses[index + 1].min} minutos`;
  } else {
    return `El próximo bus sale en ${buses[index].min} minutos`;
  }
}

function getStopId(params: any) {
  if (Number.isInteger(+params.place)) {
    if (!emt.isValidStop(params.place)) return null;
    else return params.place;
  } else {
    return emt.findStopByName(params.place);
  }
}


export const AssistantController = router;