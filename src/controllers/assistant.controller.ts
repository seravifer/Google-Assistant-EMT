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

  let stopId: any;
  if (Number.isInteger(+params.place)) {
    if (!emt.isValidStop(params.place)) return conv.ask('No existe ninguna parada con ese nombre.');
    else stopId = params.place;
  } else {
    stopId = emt.findStopByName(params.place);
    if (!stopId) return conv.ask('No existe ninguna parada con ese nombre.')
  }

  if (params.busId && !emt.isValidBus(params.busId)) return conv.ask('No existe ninguna bus con ese nombre.');

  return emt.getNextBuses(stopId, params.busId).then((buses: Bus[]) => {
    let data = (conv.data as any);
    data.count = 1;
    data.stopId = stopId;
    data.busId = params.busId;
    conv.ask(answerNextBus(buses, 0));
  })
});

app.intent('Next Bus - next', (conv, params: any) => {
  console.log('Next Bus - next');

  let data = (conv.data as any);

  data.count += 1;

  return emt.getNextBuses(data.stopId, data.busId).then((buses: Bus[]) => {
    conv.ask(answerNextBus(buses, +data.count - 1));
  })
});

app.intent('Next Buses', (conv, params: any) => {
  console.log('Next Buses');

  let stopId;
  if (Number.isInteger(params.place)) {
    if (!emt.isValidStop(params.place)) return conv.ask('No existe ninguna parada con ese nombre.');
    else stopId = params.place;
  } else {
    stopId = emt.findStopByName(params.place);
    if (!stopId) return conv.ask('No existe ninguna parada con ese nombre.')
  }

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

  return emt.getbalance(params.cardId).then((balance) => {
    conv.ask(`Te quedan ${balance} viajes`);
  }).catch(err => {
    conv.ask('Lo siento, el número de tarjeta no es válido.');
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


export const AssistantController = router;