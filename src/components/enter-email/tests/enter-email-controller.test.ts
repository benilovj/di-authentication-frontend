import { expect } from "chai";
import { describe } from "mocha";

import { sinon } from "../../../../test/utils/test-utils";
import { Request, Response } from "express";
import { AuthenticationServiceInterface } from "../../../services/authentication-service.interface";
import { enterEmailGet, enterEmailPost } from "../enter-email-controller";
import { UserSession } from "../../../types";
import { NotificationServiceInterface } from "../../../services/notification-service.interface";
import { createPasswordPost } from "../../create-password/create-password-controller";

describe("enter email controller", () => {
  let sandbox: sinon.SinonSandbox;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = { body: {}, session: { user: {} as UserSession } };
    res = { render: sandbox.fake(), redirect: sandbox.fake() };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("enterEmailGet", () => {
    it("should render enter email view", () => {
      enterEmailGet(req as Request, res as Response);

      expect(res.render).to.have.calledWith("enter-email/index.njk");
    });
  });

  describe("enterEmailPost", () => {
    it("should redirect to enter-password when account exists", async () => {
      const fakeUserAuthService: AuthenticationServiceInterface = {
        userExists: sandbox.fake.returns(true),
        signUpUser: sandbox.fake(),
        logInUser: sandbox.fake(),
      };

      req.body.email = "test.test.com";
      req.session.user.id = "dsad.dds";

      await enterEmailPost(fakeUserAuthService, null)(
        req as Request,
        res as Response
      );

      expect(fakeUserAuthService.userExists).to.have.been.calledOnce;
      expect(res.redirect).to.have.calledWith("/enter-password");
    });

    it("should redirect to /verify-email when no account exists", async () => {
      const fakeUserAuthService: AuthenticationServiceInterface = {
        userExists: sandbox.fake.returns(false),
        signUpUser: sandbox.fake(),
        logInUser: sandbox.fake(),
      };

      const fakeNotificationService: NotificationServiceInterface = {
        sendNotification: sandbox.fake(),
        verifyCode: sandbox.fake(),
      };

      req.body.email = "test.test.com";
      req.session.user.id = "sadl990asdald";

      await enterEmailPost(fakeUserAuthService, fakeNotificationService)(
        req as Request,
        res as Response
      );

      expect(res.redirect).to.have.calledWith("/check-your-email");
      expect(fakeNotificationService.sendNotification).to.have.been.calledOnce;
      expect(fakeUserAuthService.userExists).to.have.been.calledOnce;
    });

    it("should throw error when API call throws error", async () => {
      const error = new Error("Internal server error");
      const fakeUserAuthService: AuthenticationServiceInterface = {
        userExists: sandbox.fake.throws(error),
        signUpUser: sandbox.fake(),
        logInUser: sandbox.fake(),
      };

      const fakeNotificationService: NotificationServiceInterface = {
        sendNotification: sandbox.fake(),
        verifyCode: sandbox.fake(),
      };

      req.body.email = "test.test.com";
      req.session.user.id = "231dccsd";

      await expect(
        enterEmailPost(fakeUserAuthService, null)(
          req as Request,
          res as Response
        )
      ).to.be.rejectedWith(Error, "Internal server error");
      expect(fakeUserAuthService.userExists).to.have.been.calledOnce;
      expect(fakeNotificationService.sendNotification).not.to.been.called;
    });

    it("should throw error when session is not populated", async () => {
      const fakeUserAuthService: AuthenticationServiceInterface = {
        userExists: sandbox.fake.returns(""),
        signUpUser: sandbox.fake(),
        logInUser: sandbox.fake(),
      };

      const fakeNotificationService: NotificationServiceInterface = {
        sendNotification: sandbox.fake(),
        verifyCode: sandbox.fake(),
      };

      req.body.email = "test.test.com";
      req.session = undefined;

      await expect(
        enterEmailPost(fakeUserAuthService, fakeNotificationService)(
          req as Request,
          res as Response
        )
      ).to.be.rejectedWith(
        TypeError,
        "Cannot read property 'user' of undefined"
      );

      expect(fakeUserAuthService.userExists).not.to.been.called;
      expect(fakeNotificationService.sendNotification).not.to.been.called;
    });
  });
});
