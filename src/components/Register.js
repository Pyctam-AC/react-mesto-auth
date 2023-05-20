import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {Link, Navigate, useNavigate} from 'react-router-dom';
import InputForm from "./InputForm";
import Header from "./Header";

function Registr({regData}) {

  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    regData(data);
  };

  useEffect(() => {
      reset({
        email: "",
        password: "",
      });
  }, [reset]);

  return (
    <>
      <Header />
      <form
        name='Регистрация'
        className={`form`}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="sing-title">Регистрация</h3>
        <InputForm
          type="email"
          {...register("email", {
            required: "Напишите ваш email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i,
              message: "Напишите правильный адрес",
            },
          })}
          name="email"
          placeholder="Email"
          errors={errors}
          sing={true}
      />
        <InputForm
          type="password"
          {...register("password", {
            required: "Придумайте пароль",
            minLength: {
              value: 4,
              message: "Пароль должен состоять из четырёх символов",
            },
            maxLength: {
              value: 8,
              message: "Максимум восемь символов",
            },
          })}
          name="password"
          errors={errors}
          placeholder="Пароль"
          sing={true}
        />
        <button
          type="submit"
          className={`form-button form-button__white-theme`}
        >
          Зарегестрироваться
        </button>
        <p className="sing-subtitle">
          Уже зарегистрированы?
          <Link to="/signin" className="sing-subtitle-link">
            Войти
          </Link>
        </p>
      </form>
    </>
  );
}

export default Registr
