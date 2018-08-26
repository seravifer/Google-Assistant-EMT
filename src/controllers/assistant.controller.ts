import { Router } from 'express';
import { dialogflow } from 'actions-on-google';
import { EMTService } from '../services/emt.service';
import * as fs from 'fs';

const app = dialogflow();
const router = Router();
const geodb = new EMTService();

const fileRoutes = fs.readFileSync('src/data/routes.json', 'utf8');
const fileStops = fs.readFileSync('src/data/stops.json', 'utf8');
const jsonRoutes: any[] = JSON.parse(fileRoutes.toString());
const jsonStops: any[] = JSON.parse(fileStops.toString());

router.use(app);

app.intent('My Next Bus', (conv, _) => {
  console.log('My Next Bus');

  return geodb.getNextBusTime(760, '93').then((time: any) => {
    conv.ask(answerNextBus(time));
    conv.ask('¿Necesitas algo más?');
  })
});

app.intent('Next Bus', (conv, params: any) => {
  console.log('Next Bus');

  if (!isValidStop(params.stopId)) return conv.ask('No existe ninguna parada con ese nombre.');
  if (params.busId && !isValidBus(params.busId)) return conv.ask('No existe ninguna bus con ese nombre.');

  return geodb.getNextBusTime(params.stopId, params.busId).then((buses: any) => {
    conv.ask(answerNextBus(buses));
    conv.ask('¿Necesitas algo más?');
  })
});

function answerNextBus(buses: any[]) {
  if (buses.length == 0) {
    return 'Lo siento, no hay buses disponibles en estos momentos.';
  } else if (buses[0].minutos === 'Próximo') {
    return `Esta apunto de llegar, el siguiente pasa en ${buses[1].minutos.split(' ')[0]} minutos`;
  } else {
    return `El próximo bus sale en ${buses[0].minutos.split(' ')[0]} minutos`;
  }
}

function isValidStop(stopId: number) {
  return jsonStops.some(e => e == stopId);
}

function isValidBus(busId: number) {
  return typeof jsonRoutes.some(e => e == busId);
}


export const AssistantController = router;