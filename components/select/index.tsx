import ReactSelect from "react-select";
import styled from "styled-components";
import ValidationMessage from "../validationMessage";
interface ISelect {
  name?: string;
  value?: any;
  placeholder?: string;
  label?: string;
  showValidation?: boolean;
  isRequired?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isMulti?: boolean;
  options: any[];
  defaultValue?: any;
  errors?: any;
  handleChangeValue?: void | any;
}

const Option = styled.div`
  color: #000;
  font-family: "Open Sans", "Arial", Sans-Serif !important;
  padding: 5px 10px;

  &:hover {
    background: #009244ab;
  }

  background: ${(props) =>
    props.isSelected ? "#017437" : props.isFocused ? "#009244ab" : "#eee"};
  color: ${(props) => (props.isSelected || props.isFocused ? "#fff" : "#000")};
`;


const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#017437' : provided.ColorColor,
    borderWidth: '1px',
    borderStyle: 'solid', 
    transition: 'border-color 0.3s ease-in-out',
    boxShadow: state.isFocused ? '0' : provided.boxShadow,
    '&:hover': {
      borderColor: state.isFocused ? '#017437' : provided.borderColor,
    },
  }),
};

export default function Select({
  isClearable = false,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  name,
  label = "Label",
  value = "",
  options = [],
  defaultValue,
  isMulti = false,
  handleChangeValue,
  errors,
  placeholder = "Select...",
  isRequired = false,
}: ISelect) {
  const getDefaultValue = () => {
    if (defaultValue === undefined || defaultValue === null) {
      return "";
    }

    const defaultValueString = defaultValue.toString();

    if (defaultValue) {
      const foundValue = options.find(option => option.value.toString() == defaultValueString);

      if (foundValue) {
        return foundValue;
      }
    }

    return defaultValue;
  }

  return (
    <div className="">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-900 block mb-2"
      >
        {label}
        {isRequired ?
          <span className="text-red-600 text-base"> * </span> :
          <span className="text-red-600 text-base"> &nbsp; </span>
        }
      </label>

      <div className="my-2">
        <ReactSelect
          classNamePrefix="select"
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          isSearchable={isSearchable}
          name={name}
          isMulti={isMulti}
          defaultValue={getDefaultValue()}
          required={isRequired}
          value={getDefaultValue()}
          onChange={
            handleChangeValue &&
            ((option) =>
              isMulti === true
                ? handleChangeValue(name, option)
                : handleChangeValue(name, option?.value ?? ''))
          }
          options={options}
          placeholder={placeholder}
          components={{
            Option: ({ children, innerProps, innerRef, ...rest }) => (
              <Option ref={innerRef} {...innerProps} {...rest}>
                {children}
              </Option>
            ),
          }}
          styles={customStyles}
        />
      </div>

      {
        typeof errors !== "undefined" && errors !== null && errors[name] && (
          <ValidationMessage message={errors[name]} />
        )
      }
    </div>
  );
}
