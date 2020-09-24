import { app } from './index';
import config from './config';

const PORT = config.port;
app.listen(PORT, () => console.log(`Database layer server listening on ${PORT}`));
