import axios from "axios";
import React, { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import "./css/main.login.css";
import "./css/login-page.css";
import { getAssetUrl } from "../../utils/assetUrl";
import HackerLiveFeed from "../../components/HackerLiveFeed";

const registerSchema = yup.object().shape({
  username: yup.string().required("Tên tài khoản bắt buộc"),
  password: yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required(),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
  phone_number: yup
    .string()
    .matches(/^\d{10}$/, "Số điện thoại phải có 10 chữ số")
    .required("Số điện thoại bắt buộc"),
});

type RegisterFormValues = yup.InferType<typeof registerSchema>;

type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  iconSrc?: string;
  iconAlt?: string;
  showToggle?: boolean;
  visible?: boolean;
  onToggle?: () => void;
  variant?: "default" | "referral" | "phone";
};

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ReferralIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect x="4" y="6" width="20" height="16" rx="2" stroke="#F7FF00" strokeWidth="1.5" />
      <text x="7" y="18" fill="#F7FF00" fontSize="9" fontFamily="monospace" fontWeight="700">
        {"</>"}
      </text>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M8 6h4l1.5 4-2 1.2c.9 1.8 2.3 3.3 4.1 4.2L17 13.5 21 15v4c0 .6-.5 1-1.1 1C11.6 20 8 16.4 8 7.1 8 6.5 8.4 6 8 6z"
        fill="#00FF77"
      />
      <path d="M4 10h2M4 14h2M4 18h2" stroke="#00FF77" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  {
    iconSrc,
    iconAlt = "",
    placeholder,
    type = "text",
    showToggle,
    visible,
    onToggle,
    variant = "default",
    className,
    ...inputProps
  },
  ref
) {
  const fieldClass =
    variant === "referral" ? " login-field--referral" : variant === "phone" ? " login-field--phone" : "";

  return (
    <div className={`login-field${fieldClass}${className ? ` ${className}` : ""}`}>
      {variant === "referral" ? (
        <span className="login-field__icon login-field__icon--svg" aria-hidden>
          <ReferralIcon />
        </span>
      ) : variant === "phone" ? (
        <span className="login-field__icon login-field__icon--svg" aria-hidden>
          <PhoneIcon />
        </span>
      ) : iconSrc ? (
        <img className="login-field__icon" src={iconSrc} alt={iconAlt} width={32} height={32} />
      ) : null}
      <input
        ref={ref}
        className="login-field__input"
        type={showToggle ? (visible ? "text" : "password") : type}
        placeholder={placeholder}
        {...inputProps}
      />
      {showToggle ? (
        <button
          type="button"
          className="login-field__eye"
          onClick={onToggle}
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <EyeIcon />
        </button>
      ) : null}
    </div>
  );
});

const Login: React.FC = () => {
  const Cookies = require("js-cookie");

  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegPassword2, setShowRegPassword2] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const {
    register: registerField,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegisterForm,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    document.documentElement.classList.add("login-scroll-lock");
    document.body.classList.add("login-scroll-lock");
    return () => {
      document.documentElement.classList.remove("login-scroll-lock");
      document.body.classList.remove("login-scroll-lock");
    };
  }, []);

  const handleLogin = async () => {
    if (userName.trim() === "" || password.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Lỗi đăng nhập",
        text: "Vui lòng điền đầy đủ thông tin",
        customClass: {
          popup: "custom-swal",
          title: "custom-title",
          htmlContainer: "custom-text",
        },
      });
      return;
    }

    try {
      Swal.fire({
        title: "Đang xử lý...",
        html: "<p class='swal-loading-subtext'>Vui lòng chờ trong giây lát</p><div class='swal-loading-dots'><span class='swal-dot swal-dot-cyan'></span><span class='swal-dot swal-dot-orange'></span></div>",
        customClass: {
          popup: "custom-swal swal-loading-modal",
          title: "custom-title",
          htmlContainer: "custom-text",
        },
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios
        .post(`${process.env.REACT_APP_URL_API}/auth/login`, {
          username: userName,
          password,
        })
        .then(async (data) => {
          localStorage.setItem(
            "user_info",
            JSON.stringify({
              userName: data.data.user.username,
              coins: data.data.user.coins,
              role: data.data.user.role,
              id: data.data.user._id,
            })
          );

          Cookies.set("access_token", data.data.access_token, {
            expires: 1 / 24,
            secure: false,
            sameSite: "Lax",
          });

          await new Promise((resolve) => setTimeout(resolve, 100));

          if (
            (data.status === 200 || data.status === 201) &&
            (data.data.user.role === "SUPERADMIN" || data.data.user.role === "ADMIN")
          ) {
            Swal.fire({
              icon: "success",
              title: "Đăng nhập thành công",
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
                htmlContainer: "custom-text",
              },
            });
            setTimeout(() => {
              window.location.href = "/admin";
            }, 500);
          } else {
            Swal.fire({
              icon: "success",
              title: "Đăng nhập thành công",
              text: "Vui lòng đợi ít phút. ",
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
                htmlContainer: "custom-text",
              },
            });
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          }
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            Swal.fire({
              icon: "error",
              title: "Lỗi đăng nhập",
              text: "Tài khoản/mật khẩu không chính xác!",
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
                htmlContainer: "custom-text",
              },
            });
          }
        });
    } catch (error) {
      return error;
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    try {
      const managedByUsername =
        referralCode.trim() !== "" ? referralCode.trim() : "superadmin";
      await axios
        .post(`${process.env.REACT_APP_URL_API}/auth/register`, {
          username: data.username,
          managedByUsername,
          phone: data.phone_number,
          password: String(data.password),
        })
        .then((res) => {
          if (res.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Đăng ký thành công",
              text: "Vui lòng đợi ít phút. ",
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
                htmlContainer: "custom-text",
              },
            });
            resetRegisterForm();
            setAuthView("login");
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Lỗi đăng ký",
            text: `${err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!"}`,
            customClass: {
              popup: "custom-swal",
              title: "custom-title",
              htmlContainer: "custom-text",
            },
          });
        });
    } catch (error) {
      return error;
    }
  };

  const goRegister = () => {
    setAuthView("register");
    setReferralCode("");
    resetRegisterForm();
  };

  const goLogin = () => {
    setAuthView("login");
    setReferralCode("");
    resetRegisterForm();
  };

  return (
    <div className="login-page">
      <img
        className="login-page__logo"
        src={getAssetUrl("/assets/logo.png")}
        alt="Slot X CORE"
        width={572}
        height={215}
      />

      <p className="login-page__tagline">
        &gt;Tool tích hợp công nghệ ai agent phân tích siêu chuẩn&lt;
      </p>

      <div className="login-page__auth-stack">
        <div className="login-page__robot-float" aria-hidden>
          <img className="login-page__robot-float-img" src={getAssetUrl("/assets/robot.gif")} alt="" />
        </div>

        <div
          className="login-page__modal"
          style={{ backgroundImage: `url(${getAssetUrl("/assets/frame-login.png")})` }}
          role="dialog"
          aria-label={authView === "login" ? "Đăng nhập" : "Đăng ký"}
        >
          <div className="login-page__modal-inner">
          <div className="login-page__robot-col">
            <img
              className="login-page__robot"
              src={getAssetUrl("/assets/robot.gif")}
              alt=""
            />
          </div>

          <div
            className={`login-page__form-col${
              authView === "register" ? " login-page__form-col--register" : ""
            }`}
          >
            <h2 className="login-page__form-title">
              {authView === "login" ? "Đăng nhập" : "Đăng ký"}
            </h2>

            {authView === "login" ? (
              <form
                className="login-page__form"
                id="loginform"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <AuthField
                  iconSrc={getAssetUrl("/assets/icon-user.png")}
                  placeholder="Nhập tên đăng nhập"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="username"
                  maxLength={16}
                />

                <AuthField
                  iconSrc={getAssetUrl("/assets/icon-pass.png")}
                  placeholder="Nhập mật khẩu"
                  showToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  maxLength={16}
                />

                <button type="submit" className="login-page__submit">
                  &gt; Đăng nhập &lt;
                </button>
              </form>
            ) : (
              <form
                className="login-page__form login-page__form--register"
                id="registerform"
                onSubmit={handleRegisterSubmit(onRegister)}
                noValidate
              >
                <AuthField
                  iconSrc={getAssetUrl("/assets/icon-user.png")}
                  placeholder="Nhập tên đăng nhập"
                  autoComplete="username"
                  {...registerField("username")}
                />
                {registerErrors.username && (
                  <p className="login-page__error">{registerErrors.username.message}</p>
                )}

                <AuthField
                  iconSrc={getAssetUrl("/assets/icon-pass.png")}
                  placeholder="Nhập mật khẩu"
                  showToggle
                  visible={showRegPassword}
                  onToggle={() => setShowRegPassword((v) => !v)}
                  autoComplete="new-password"
                  {...registerField("password")}
                />
                {registerErrors.password && (
                  <p className="login-page__error">{registerErrors.password.message}</p>
                )}

                <AuthField
                  iconSrc={getAssetUrl("/assets/icon-pass.png")}
                  placeholder="Nhập lại mật khẩu"
                  showToggle
                  visible={showRegPassword2}
                  onToggle={() => setShowRegPassword2((v) => !v)}
                  autoComplete="new-password"
                  {...registerField("password_confirmation")}
                />
                {registerErrors.password_confirmation && (
                  <p className="login-page__error">
                    {registerErrors.password_confirmation.message}
                  </p>
                )}

                <AuthField
                  variant="phone"
                  placeholder="+84 . . ."
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  {...registerField("phone_number")}
                />
                {registerErrors.phone_number && (
                  <p className="login-page__error">{registerErrors.phone_number.message}</p>
                )}

                <AuthField
                  variant="referral"
                  placeholder="Nhập mã giới thiệu (nếu có)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />

                <button type="submit" className="login-page__submit">
                  &gt; Đăng ký &lt;
                </button>
              </form>
            )}

            {authView === "login" ? (
              <p className="login-page__footer">
                Chưa có tài khoản?{" "}
                <span
                  className="login-page__link"
                  role="button"
                  tabIndex={0}
                  onClick={goRegister}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goRegister();
                    }
                  }}
                >
                  Link đăng ký
                </span>
              </p>
            ) : (
              <p className="login-page__footer">
                Đã có tài khoản?{" "}
                <span
                  className="login-page__link"
                  role="button"
                  tabIndex={0}
                  onClick={goLogin}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goLogin();
                    }
                  }}
                >
                  Link đăng nhập
                </span>
              </p>
            )}
          </div>
          </div>
        </div>
      </div>

      <HackerLiveFeed side="left" variant="live" />
      <HackerLiveFeed side="right" variant="terminal" />
    </div>
  );
};

export default Login;
