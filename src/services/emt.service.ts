import { HttpClient } from 'typed-rest-client/HttpClient';
import { busesMapper } from './bus.model';
import { balanceMapper } from './balance.model';
import Fuse from 'fuse.js';
import * as fs from 'fs';

export class EMTService {

  private options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"]
  };

  private httpc = new HttpClient('node-api-user-agent');
  private fileRoutes = fs.readFileSync('src/data/routes.json', 'utf8');
  private fileStops = fs.readFileSync('src/data/stops.json', 'utf8');
  private jsonRoutes: any[] = JSON.parse(this.fileRoutes.toString());
  private jsonStops: any[] = JSON.parse(this.fileStops.toString());
  private fuse = new Fuse(this.jsonStops, this.options);


  async getNextBuses(stopBus: number, busId?: string) {
    let response = await this.httpc.get(`http://www.emtvalencia.es/EMT/mapfunctions/MapUtilsPetitions.php?sec=getSAE&idioma=es&parada=${stopBus}&linea=${busId || ''}&adaptados=false`);
    return await busesMapper(await response.readBody());
  }

  async getbalance(card_id: number) {
    let response = await this.httpc.post(`https://www.emtvalencia.es/ciudadano/modules/mod_saldo/busca_saldo.php`, `numero=${card_id}&idioma=es`, { 'Content-Type': 'application/x-www-form-urlencoded' });
    return await balanceMapper(await response.readBody());
  }

  isValidStop(stopId: number) {
    return this.jsonStops.some(e => e.id == stopId);
  }
  
  isValidBus(busId: number) {
    return typeof this.jsonRoutes.some(e => e == busId);
  }
  
  findStopByName(name: string) {
    var result: any[] = this.fuse.search(name);
    return result.length > 0 ? result[0].id : null;
  }

}