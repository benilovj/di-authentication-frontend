import { expect } from "chai";
import { describe } from "mocha";

import { sinon } from "../../../../test/utils/test-utils";
import { Request, Response } from "express";

import {
  resetPasswordGet,
  resetPasswordPost,
} from "../reset-password-controller";
import { ResetPasswordServiceInterface } from "../types";
import { PATH_NAMES } from "../../../app.constants";

describe("reset password controller", () => {
  let sandbox: sinon.SinonSandbox;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = {
      body: {},
      query: {},
      session: { user: { state: { resetPassword: {} } } },
    };
    res = { render: sandbox.fake(), redirect: sandbox.fake(), locals: {} };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("resetPasswordGet", () => {
    it("should render change password page", () => {
      req.query.code = "asdkki8ddas.1758350212000";

      resetPasswordGet(req as Request, res as Response);

      expect(res.render).to.have.calledWith("reset-password/index.njk");
    });
  });

  describe("resetPasswordPost", () => {
    it("should redirect to /reset-password-confirmation page", async () => {
      const fakeService: ResetPasswordServiceInterface = {
        updatePassword: sandbox.fake.returns({ success: true }),
      };

      req.body.password = "Password1";
      req.body.code = "asdkki8ddas.1758350212000";

      await resetPasswordPost(fakeService)(req as Request, res as Response);

      expect(fakeService.updatePassword).to.have.been.calledOnce;
      expect(res.redirect).to.have.calledWith(
        PATH_NAMES.RESET_PASSWORD_CONFIRMATION
      );
    });
  });
});