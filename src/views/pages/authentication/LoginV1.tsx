import { Link, useHistory } from "react-router-dom";
import { Facebook, Twitter, Mail, GitHub, Coffee, Loader, AlertTriangle, XOctagon } from "react-feather";

import InputPasswordToggle from "@components/input-password-toggle";

import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Button,
  Spinner,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import themeConfig from "../../../configs/themeConfig";
import { useForm } from "react-hook-form";
import { getHomeRouteForLoggedInUser, isObjEmpty } from "@utils";
import { encodePass } from "../../../utility/Utils";
import React, { Fragment, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { AbilityContext } from "@src/utility/context/Can";
import { useSkin } from "@hooks/useSkin";
import useApi from "../../../services/UseAppApi";
import { handleLogin } from "@store/actions/auth";
import classnames from "classnames";
import Avatar from "@components/avatar";
import { Slide, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { isUserLoggedIn } from "@utils";
import * as CryptoJS from 'crypto-js';
import { appStore } from "../../../stores/appStore";
import Constants from "../../../stores/appTypes";

const ToastContent = ({ name, mess, type }: any) => (
  <Fragment>

    <div className="toastify-header">

      <div className="title-wrapper">

        {
          type === 'success' ? (
            <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
          ) : (
            type === 'warning' ? (
              <Avatar size="sm" color="warning" icon={<AlertTriangle size={12} />} />
            ) : (
              <Avatar size="sm" color="danger" icon={<XOctagon size={12} />} />
            )
          )
        }


        <h6 className="toast-title font-weight-bold">{name}</h6>
      </div>
    </div>

    <div className="toastify-body">

      <span>
        {mess}
      </span>
    </div>
  </Fragment>
);

const LoginV1 = () => {
  const { register, errors, handleSubmit } = useForm();
  const [skin, setSkin] = useSkin();
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const [username, setUserName] = useState();
  const [passwordEn, setPasswordEn] = useState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const keyEncryted = CryptoJS.enc.Utf8.parse("!Tvsi@2022#$%^&*");

  const onSubmit = (data: any) => {
    setLoading(true);
    if (isObjEmpty(errors)) {
      const loginName = username;
      // const password = passwordEn;
      const passwordEncr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(passwordEn), keyEncryted, {
        keySize: 128 / 8,
        iv: keyEncryted,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      const password = '' + passwordEncr;

      useApi
        .login({ loginName, password })
        .then((res) => {
          setLoading(false);
          if (res.data.Code === "0") {
            if (!res.data.Data[0] || !res.data.Data[0].Menus) {
              toast.warning(
                <ToastContent
                  name={"Không thành công"}
                  mess={"Bạn không có quyền truy cập vào hệ thống!"}
                  type="warning"
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 2000 }
              );
            } else {
              let funcArr = res.data.Data[0].Functions ? (res.data.Data[0].Functions.filter(item=>item.FunctionCode === "IW_CA_Customer") ?? []) : []; //Quyen phan cong lich goi cho sale call in app
              let funcArrToCheck = (funcArr.length > 0 && funcArr[0].RightData) ? funcArr.filter(item => item.RightData.indexOf("SUBLEVEL")>-1 || item.RightData.indexOf("ONLYBRANCH")>-1 || item.RightData.indexOf("SUBBRANCH")>-1|| item.RightData.indexOf("ALLRIGHT")>-1) : []
              const userData = {
                LoginName: res.data.Data[0].LoginName,
                Email: res.data.Data[0].Email,
                Phone: res.data.Data[0].Phone,
                ShowCaptcha: res.data.Data[0].ShowCaptcha,
                Menus: res.data.Data[0].Menus,
                Functions: res.data.Data[0].Functions,
                SaleId:res.data.Data[0].SaleId,
                ability: [{ action: "manage", subject: "all" }],
                HasAssignSale:funcArrToCheck.length
              };

              const data = {
                ...userData,
                AccessToken: res.data.Data[0].AccessToken,
                RefreshToken: res.data.Data[0].RefreshToken,
                AccessTokenExpiration: res.data.Data[0].AccessTokenExpiration,
                RefreshTokenExpiration: res.data.Data[0].RefreshTokenExpiration
              };
              toast.success(
                <ToastContent
                  name={"Chào mừng, " + data.LoginName}
                  mess={"Bạn đã đăng nhập thành công!"}
                  type="success"
                />,
                { transition: Slide, hideProgressBar: true, autoClose: 2000 }
              );
              setTimeout(() => {
                
                dispatch(handleLogin(data));
  
                const abil = [
                  {
                    action: "manage",
                    subject: "all"
                  }
                ]
                ability.update(abil);
                // history.push(getHomeRouteForLoggedInUser(data.role))
                history.push(getHomeRouteForLoggedInUser("admin"));
  
                appStore.GetAccounts();
                window.location.reload();
              }, 1000);
              
            }
          } else {
            setLoading(false);
            toast.error(
              <ToastContent name={"Lỗi!"} mess={res.data.Message} type="danger" />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            );
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
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

            <CardTitle tag="h4" className="mb-1 text-center">

              {t('System_Name')}
            </CardTitle>


            <CardText className="mb-2 text-center">
              Dùng tài khoản user domain để đăng nhập
            </CardText>


            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>


                <Label className="form-label" for="login-email">

                  Tài khoản
                </Label>


                <Input
                  autoFocus
                  type="text"
                  value={username}
                  id="login-email"
                  name="login-email"
                  placeholder="tài khoản"
                  onChange={(e: any) => setUserName(e.target.value)}
                  // className={classnames({ 'is-invalid': errors['login-email'] })}
                  innerRef={register({
                    required: true,
                    validate: (value) => value !== "",
                  })}
                />
              </FormGroup>
              <FormGroup>

                <div className="d-flex justify-content-between">


                  <Label className="form-label" for="login-password">

                    Mật khẩu
                  </Label>


                  {/* <Link to="/pages/forgot-password-v1">
                  
                  
                  <small>Forgot Password?</small>
                </Link> */}
                </div>


                <InputPasswordToggle
                  value={passwordEn}
                  id="login-password"
                  name="login-password"
                  className="input-group-merge"
                  onChange={(e: any) => setPasswordEn(e.target.value)}

                  className={classnames({
                    "is-invalid": errors["login-password"],
                  })}
                  innerRef={register({
                    required: true,
                    validate: (value) => value !== "",
                  })}
                />
              </FormGroup>
              <FormGroup>


                <CustomInput
                  type="checkbox"
                  className="custom-control-Primary"
                  id="remember-me"
                  label="Lưu tài khoản"
                />
              </FormGroup>

              {!loading ? (
                <Button.Ripple type="submit" color="primary" block className="mb-2">

                  Đăng nhập
                </Button.Ripple>
              ) : (
                <Button.Ripple color="primary" block className="mb-2">

                  <Spinner type='grow' color='light' size='sm' />{" "}
                  <Spinner type='grow' color='light' size='sm' />{" "}
                  <Spinner type='grow' color='light' size='sm' />
                </Button.Ripple>
              )
              }
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
};

export default LoginV1;
