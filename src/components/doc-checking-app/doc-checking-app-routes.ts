import { PATH_NAMES } from "../../app.constants";

import * as express from "express";
import { validateSessionMiddleware } from "../../middleware/session-middleware";
import { asyncHandler } from "../../utils/async";
import { allowUserJourneyMiddleware } from "../../middleware/allow-user-journey-middleware";
import { docCheckingAppGet } from "./doc-checking-app-controller";

const router = express.Router();

router.get(
  PATH_NAMES.DOC_CHECKING_APP,
  validateSessionMiddleware,
  allowUserJourneyMiddleware,
  asyncHandler(docCheckingAppGet())
);

export { router as docCheckingAppRouter };
