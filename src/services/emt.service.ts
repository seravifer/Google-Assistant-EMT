import * as http from 'typed-rest-client/HttpClient';
import * as xml from 'xml2js';

export class EMTService {

  private static readonly BASE_URL = 'http://www.emtvalencia.es/EMT/mapfunctions/MapUtilsPetitions.php';

  private httpc = new http.HttpClient('node-api-user-agent');

  async getNextBusTime(stopBus: number, busId?: string) {
    let response = await this.httpc.get(`${EMTService.BASE_URL}?sec=getSAE&idioma=es&parada=${stopBus}&linea=${busId || ''}&adaptados=false`);
    let body = await response.readBody();
    return await this.parseXml(body);
  }

  parseXml(body: any) {
    return new Promise((resolve, reject) => {
      xml.parseString(body, { trim: true, explicitArray: false }, (err: any, result: any) => {
        if ((result.estimacion.parada_linea.bus && result.estimacion.parada_linea.bus.error) || (result.estimacion.solo_parada.bus && result.estimacion.solo_parada.bus.error)) resolve([]);
        resolve(result.estimacion.parada_linea.bus || result.estimacion.solo_parada.bus || []);
      });
    });
  }

}