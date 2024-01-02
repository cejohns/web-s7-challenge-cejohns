import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../styles/styles.css';

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
};

const validationSchema = yup.object().shape({
  fullName: yup.string().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong).required(),
  size: yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect).required(),
});

const sizeNames = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
};

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitSuccessful, isValid }, // Use isValid instead of isSubmitSuccessful
  //   reset,
  // } = useForm({
  //   resolver: yupResolver(validationSchema),
  // });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [form, setForm] = useState({ fullName: '', size: '', toppings: [] });
  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({ fullName: null, size: null });

  const handleToppingChange = (topping_id) => {
    let currentSelectedToppings = form.toppings;
    if (currentSelectedToppings.indexOf(topping_id) >= 0) {
      currentSelectedToppings = [...currentSelectedToppings.filter(topping => topping != topping_id)];
    } else {
      currentSelectedToppings = [...currentSelectedToppings, topping_id]
    }
    setForm({ ...form, toppings: [...currentSelectedToppings] });
  }

  const handleSizeChange = (event) => {
    const { value } = event.target;

    yup
    .reach(validationSchema, 'size')
    .validate(value)
    .then(() => {
      console.log('valid size changed', value);
      setErrorMessage(null); // Clear any previous error message
      setErrors({ ...errors, size: null }); // Set the error message
      const formValues = { ...form, size: value };
      validationSchema.isValid(formValues).then((valid) => {
        setDisabled(!valid);
      });
    })
    .catch((err) => {
      console.log('!invalid size changed', value);
      setErrors({ ...errors, size: err.errors[0] }); // Set the error message
      setDisabled(true);
    });
    setForm({ ...form, size:event.target.value});
  }

  const handleFullNameChange = (data) => {
    const { value } = data.target;
        const fName = value.trim();
    yup
      .reach(validationSchema, 'fullName')
      .validate(fName)
      .then(() => {
        setErrorMessage(null); // Clear any previous error message
        setErrors({ ...errors, fullName: null }); // Set the error message
        const formValues = { ...form, fullName: value };
        validationSchema.isValid(formValues).then((valid) => { 
    
          if(errors.size === null) setDisabled(!valid);
        });
      })
      .catch((err) => {
        setErrors({ ...errors, fullName: err.errors[0] }); // Set the error message
        setDisabled(true);
      });

    setForm({ ...form, fullName: value });
  };


  const onSubmit = (data) => {
    data.preventDefault();
    // Validate full name
    if (!form.fullName) {
      // If full name is empty
      setErrorMessage(validationErrors.fullNameTooShort);
    } else if (form.fullName.length < 3) {
      // If full name doesn't have both first and last names

      setErrorMessage(validationErrors.fullNameTooShort);
      //return validationSchema.fullNameTooShort;

    } else if (form.fullName.length > 20) {
      setErrorMessage(validationErrors.fullNameTooLong);
    } else {
      // Perform any necessary actions with the form data
      let message = `Thank you for your order, ${form.fullName}! Your ${ sizeNames[form.size].toLowerCase()} pizza`;
      if (form.toppings.length === 0) {
        message += ' with no toppings';
      } else {
        message += ` with ${form.toppings.length} toppings`;
      }

      message += ' is on the way.';
      setSuccessMessage(message);
      setForm({ fullName: '', size: '', toppings: [] }); // Reset the form after successful submission
    }


    // const selectedToppings = Object.entries(toppings)
    //   .filter(([_, isSelected]) => isSelected)
    //   .map(([topping]) => topping);



  };



  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {successMessage && <div className='success'>{successMessage}</div>}
      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" onChange={handleFullNameChange} value={form.fullName} />
          {errors.fullName && <div className='error'>{errors.fullName}</div>}

        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" onChange={handleSizeChange} value={form.size}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {errors.size && <div className='error'>{errors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              checked={form.toppings.indexOf(topping.topping_id) != -1}
              onChange={() => handleToppingChange(topping.topping_id)}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>

      <input type="submit" disabled={disabled} />
    </form>
  );
}
