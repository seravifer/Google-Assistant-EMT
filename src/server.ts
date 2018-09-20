import { EMTController, MetroController } from './controllers';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const app: express.Application = express.default();
const port = 3000;

app.use(bodyParser.json());
app.use('/emt', EMTController);
app.use('/metro', MetroController);
// TODO: valenbici

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});