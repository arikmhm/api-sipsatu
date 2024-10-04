// src/main.js

import { logger } from "./app/logging.js";
import { web } from "./app/web.js";

const port = 3000;
web.listen(port, () => {
  logger.info(`App started and listening on port ${port}`);
});
