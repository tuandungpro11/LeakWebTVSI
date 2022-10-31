import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardFooter, CardText, CardTitle, Spinner } from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import themeConfig from "../../../configs/themeConfig";
import { CheckCircle, ChevronLeft, XCircle } from "react-feather";
import { userStore } from "../store/UserStore";

const VerifyUser = () =>
  useObserver(() => {
    const paramsURL = useParams();
    const successVerify = () => {
      return (
        <>
          <CardText className="mb-2 text-center">
            <CheckCircle size={60} className="color-success" />
          </CardText><CardTitle tag="h4" className="mb-1 text-center">
            Xác thực thành công
          </CardTitle>
        </>
      )
    }
    const errorVerify = () => {
      return (
        <>
          <CardText className="mb-2 text-center">
            <XCircle size={60} className="color-error" />
          </CardText>
          <CardTitle tag="h4" className="mb-1 text-center">
            Xác thực không thành công
          </CardTitle>
        </>
      )
    }
    useEffect(() => {
      const param = `${paramsURL.userId}/${paramsURL.token}`;
      userStore.VerifyAccount(param);
    }, [])
    // console.log('params: ', );
    return (
      <Fragment>
        <div className="auth-wrapper auth-v1 px-2">

          <div className="auth-inner py-2">

            <Card className="mb-0">

              <CardBody>

                <Link
                  className="brand-logo"
                  to="/"
                  onClick={(e) => e.preventDefault()}
                >

                  <img src={themeConfig.app.appLogoImage} alt="logo" />

                  {/* <h2 className="brand-text text-primary ml-1">TVSI</h2> */}
                </Link>
                {userStore.verifingUser ? (
                  <>
                    <CardText className="mb-2 text-center">
                      <Spinner type='grow' color='info' className="mr-1" />
                      <Spinner type='grow' color='info' className="mr-1" />
                      <Spinner type='grow' color='info' />
                    </CardText><CardTitle tag="h4" className="mb-1 text-center">
                      Hệ thống đang xác thực tài khoản
                    </CardTitle><CardText className="mb-2 text-center">
                      Vui lòng chờ trong giây lát
                    </CardText>
                  </>
                ) : (
                  userStore.verifiedUser ? (
                    successVerify()
                  ) : (
                    errorVerify()
                  )
                )
                }
                <CardFooter className="text-center">
                  <Link to="/login">
                    <Button.Ripple color='primary' disabled={userStore.verifingUser}>Đăng nhập</Button.Ripple>
                  </Link>
                </CardFooter>

              </CardBody>
            </Card>
          </div>
        </div>
      </Fragment>
    )
  });

export default VerifyUser;