import { forwardRef } from 'react';

const InputForm = forwardRef(
  function InputForm ({
    type,
    name,
    placeholder,
    onChange,
    errors,
    sing
  },
    ref
  ) {
  return (
    <>
      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className={`input
        ${sing? "input__black-theme" : ""}
          input_type_${name}
          ${errors[name]? "popup__input_invalid" : ""}`}
      />
      {errors &&
        <span className={`error input-error-${name}`}>
          {errors[name]?.message || ""}
        </span>
      }
    </>
  );
})

export default InputForm;

/* {`
          popup__input
           ${errors ? 'popup__input_invalid' : ''}
           `} */
