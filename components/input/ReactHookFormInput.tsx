import ValidationMessage from "../validationMessage";

interface IReactHookFormInput {
  name?: string;
  value?: any;
  inputChange?: void | any;
  handleBlur?: void | any;
  placeholder?: string;
  label?: string;
  type?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  errors?: any;
  minValue?: any;
  maxValue?: any;
  areaClassNames?: string;
  hintText?: string;
  rows?: number;
  checked?: boolean;
  register?: any;
  validations?: any;
  validationMessages?: any;
}

export default function ReactHookFormInput({
  name = "text",
  value,
  inputChange,
  placeholder = "Type Here",
  label = "Label",
  type = "text",
  isRequired = false,
  isDisabled = false,
  errors,
  minValue,
  maxValue,
  areaClassNames = '',
  hintText = '',
  rows = 3,
  checked = false,
  register,
  validations,
  validationMessages
}: IReactHookFormInput) {

  const hasInputError = typeof errors !== "undefined" && errors !== null && errors[name];

  const getInputClasses = () => {
    return `shadow-sm 
      border 
      ${hasInputError ? 'bg-red-50 border border-red-500 text-red-900' :
        'border-gray-300 text-gray-900 '}
      sm:text-sm 
      rounded-md 
      focus:ring-cyan-600 
      focus:border-cyan-600 
      block 
      w-full 
      p-2 
      my-2 
      ${isDisabled ? 'bg-gray-100' : 'bg-gray-50'}
      `;
  }

  return (
    <div className={areaClassNames}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-900 block mb-2"
      >
        {label}{" "}
        {isRequired && <span className="text-red-600 text-base"> * </span>}
      </label>

      {
        type === 'textarea' &&
        <textarea
          id={name}
          name={name}
          value={value}
          disabled={isDisabled}
          required={isRequired}
          className={getInputClasses()}
          placeholder={placeholder}
          onChange={inputChange && ((e) => inputChange(name, e.target.value))}
          rows={rows}
        ></textarea>
      }

      {
        type !== 'textarea' && type !== 'checkbox' &&
        <input
          {
          ...register(
            name,
            validations
          )
          }
          id={name}
          type={type}
          name={name}
          value={value}
          disabled={isDisabled}
          required={isRequired}
          min={minValue && minValue}
          max={maxValue && maxValue}
          className={getInputClasses()}
          placeholder={placeholder}
          onChange={
            inputChange && ((e) => inputChange(name, e.target.value))
          }
        />
      }

      {
        type === 'checkbox' &&
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          disabled={isDisabled}
          required={isRequired}
          className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
          placeholder={placeholder}
          checked={checked}
          onChange={inputChange && ((e) => inputChange(name, e.target.checked ? 1 : 0))}
        />
      }

      {/* {
        hasInputError && (
          <ValidationMessage
            message={
              errors[name]?.type === 'required' ?
                validationMessages?.required :
                errors[name]?.type === 'minLength' ?
                  validationMessages?.minLength :
                  errors[name]?.type === 'maxLength' ?
                    validationMessages?.maxLength :
                    errors[name]?.type === 'regex' ?
                      validationMessages?.regex : ''
            }
          />
        )
      } */}
      {
        hasInputError && (
          <ValidationMessage
            message={
              errors[name]?.message
            }
          />
        )
      }

      {
        hintText !== '' &&
        <p className="text-gray-500 mt-1 text-xs">{hintText}</p>
      }
    </div>
  );
}
