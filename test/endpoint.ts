import { EMTService } from '../src/services/emt.service';
import { MetroService } from '../src/services/metro.service';

const emt = new EMTService();
const metro = new MetroService();

metro.getbalance(3695976254).then((res: any) => console.log(res));