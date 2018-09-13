import { EMTService } from '../src/services/emt.service';

const geodb = new EMTService();

geodb.getNextBusTime(760).then((buses: any) => {
    console.log(buses);
});