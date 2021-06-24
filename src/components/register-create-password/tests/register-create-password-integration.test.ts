import request from "supertest";
import { after, describe } from "mocha";
import { expect, sinon } from "../../../../test/utils/test-utils";
import nock = require("nock");
import * as cheerio from "cheerio";
import * as sessionMiddleware from "../../../middleware/session-middleware";

describe("Integration::register create password", () => {
  let sandbox: sinon.SinonSandbox;
  let token: string | string[];
  let cookies: string;
  let app: any;
  let baseApi: string;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(sessionMiddleware, "validateSessionMiddleware")
      .callsFake(function (req: any, res: any, next: any): void {
        req.session.user = {
          id: "12sadjk",
          scope: "openid",
          email: "test@test.com",
        };
        next();
      });

    app = require("../../../app").createApp();
    baseApi = process.env.API_BASE_URL;

    request(app)
      .get("/create-password")
      .end((err, res) => {
        const $ = cheerio.load(res.text);
        token = $("[name=_csrf]").val();
        cookies = res.headers["set-cookie"];
      });
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  after(() => {
    sandbox.restore();
  });

  it("should return create password page", (done) => {
    request(app).get("/create-password").expect(200, done);
  });

  it("should return error when csrf not present", (done) => {
    request(app)
      .post("/create-password")
      .type("form")
      .send({
        email: "test@test.com",
        password: "test@test.com",
      })
      .expect(500, done);
  });

  it("should return validation error when password not entered", (done) => {
    request(app)
      .post("/create-password")
      .type("form")
      .set("Cookie", cookies)
      .send({
        _csrf: token,
        password: "",
        "confirm-password": "",
      })
      .expect(function (res) {
        const $ = cheerio.load(res.text);
        expect($("#password-error").text()).to.contains("Enter your password");
        expect($("#confirm-password-error").text()).to.contains(
          "Retype your password"
        );
      })
      .expect(400, done);
  });

  it("should return validation error when passwords don't match", (done) => {
    request(app)
      .post("/create-password")
      .type("form")
      .set("Cookie", cookies)
      .send({
        _csrf: token,
        password: "sadsadasd33da",
        "confirm-password": "sdnnsad99d",
      })
      .expect(function (res) {
        const $ = cheerio.load(res.text);
        expect($("#confirm-password-error").text()).to.contains(
          "Enter the same password in both fields"
        );
      })
      .expect(400, done);
  });

  it("should return validation error when password less than 8 characters", (done) => {
    request(app)
      .post("/create-password")
      .type("form")
      .set("Cookie", cookies)
      .send({
        _csrf: token,
        password: "dad",
        "confirm-password": "",
      })
      .expect(function (res) {
        const $ = cheerio.load(res.text);
        expect($("#password-error").text()).to.contains(
          "Your password must be 8 characters or more"
        );
      })
      .expect(400, done);
  });

  it("should return validation error when password not valid", (done) => {
    request(app)
      .post("/create-password")
      .type("form")
      .set("Cookie", cookies)
      .send({
        _csrf: token,
        password: "testpassword",
        "confirm-password": "testpassword",
      })
      .expect(function (res) {
        const $ = cheerio.load(res.text);
        expect($("#password-error").text()).to.contains(
          "Your password must include a number"
        );
      })
      .expect(400, done);
  });

  it("should redirect to enter phone number when valid password entered", (done) => {
    nock(baseApi).post("/signup").once().reply(200, {
      sessionState: "TWO_FACTOR_REQUIRED",
    });

    request(app)
      .post("/create-password")
      .type("form")
      .set("Cookie", cookies)
      .send({
        _csrf: token,
        password: "testpassword1",
        "confirm-password": "testpassword1",
      })
      .expect("Location", "/enter-phone-number")
      .expect(302, done);
  });
});