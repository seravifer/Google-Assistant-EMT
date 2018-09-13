import { Router } from 'express';
import { dialogflow, Table } from 'actions-on-google';
import { EMTService } from '../services/emt.service';
import { Bus } from '../services/bus.model';
import Fuse from 'fuse.js';
import * as fs from 'fs';

const app = dialogflow();
const router = Router();
const geodb = new EMTService();

const fileRoutes = fs.readFileSync('src/data/routes.json', 'utf8');
const fileStops = fs.readFileSync('src/data/stops.json', 'utf8');
const jsonRoutes: any[] = JSON.parse(fileRoutes.toString());
const jsonStops: any[] = JSON.parse(fileStops.toString());

const options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["name"]
};
const fuse = new Fuse(jsonStops, options);

router.use(app);

app.intent('My Next Bus', (conv, _) => {
  console.log('My Next Bus');

  return geodb.getNextBusTime(760, '93').then((time: any) => {
    conv.ask(answerNextBus(time));
  })
});

app.intent('Next Bus', (conv, params: any) => {
  console.log('Next Bus');

  let stopId;
  if (Number.isInteger(+params.place)) {
    if (!isValidStop(params.place)) return conv.ask('No existe ninguna parada con ese nombre.');
    else stopId = params.place;
  } else {
    stopId = findStopByName(params.place);
    if (!stopId) return conv.ask('No existe ninguna parada con ese nombre.')
  }

  if (params.busId && !isValidBus(params.busId)) return conv.ask('No existe ninguna bus con ese nombre.');

  return geodb.getNextBusTime(stopId, params.busId).then((buses: Bus[]) => {
    // conv.user.storage
    conv.ask(answerNextBus(buses));
  })
});

app.intent('Next Buses', (conv, params: any) => {
  console.log('Next Buses');

  let stopId;
  if (Number.isInteger(+params.place)) {
    if (!isValidStop(params.place)) return conv.ask('No existe ninguna parada con ese nombre.');
    else stopId = params.place;
  } else {
    stopId = findStopByName(params.place);
    if (!stopId) return conv.ask('No existe ninguna parada con ese nombre.')
  }

  return geodb.getNextBusTime(stopId).then((buses: Bus[]) => {
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

  return geodb.getbalance(params.cardId).then((balance) => {
    conv.ask(`Te quedan ${balance} viajes`);
  }).catch(error => {
    conv.ask('El número de tarjeta no es válido, pruebe con otro.');
  });
});

function answerNextBus(buses: Bus[]) {
  if (buses.length == 0) {
    return 'Lo siento, no hay buses disponibles en estos momentos.';
  } else if (buses[0].min == 0) {
    return `Esta apunto de llegar, el siguiente pasa en ${buses[1].min} minutos`;
  } else {
    return `El próximo bus sale en ${buses[0].min} minutos`;
  }
}

function isValidStop(stopId: number) {
  return jsonStops.some(e => e.id == stopId);
}

function isValidBus(busId: number) {
  return typeof jsonRoutes.some(e => e == busId);
}

function findStopByName(name: string) {
  var result: any[] = fuse.search(name);
  return result.length > 0 ? result[0].id : null;
}

export const AssistantController = router;