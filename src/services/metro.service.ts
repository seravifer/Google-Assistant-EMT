import { HttpClient } from 'typed-rest-client/HttpClient';
import { balanceMapperMetro } from '../model/balance.model';

export class MetroService {

  private httpc = new HttpClient('node-api-user-agent');

  async getbalance(card_id: number) {
    let response = await this.httpc.post(`http://www.metrovalencia.es/tools_consulta_tsc.php`, `tsc=${card_id}`, { 'Content-Type': 'application/x-www-form-urlencoded' });
    return await balanceMapperMetro(await response.readBody());
  }

}