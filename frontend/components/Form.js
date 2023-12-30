import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be small, meduim or large'
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [successMessage, setSuccessMessage] = useState(null);

  const onSubmit = (data) => {
    console.log('Submitted data:', data);
    // Perform any necessary actions with the form data
    const { fullName, size, toppings } = data;

    let message = `Thank you for your order, ${fullName}! Your ${sizeNames[size]} pizza`;
  
    const selectedToppings = Object.entries(toppings)
      .filter(([_, isSelected]) => isSelected)
      .map(([topping]) => topping);
  
    if (selectedToppings.length === 0) {
      message += ' with no toppings';
    } else {
      message += ` with ${selectedToppings.join(', ')} toppings`;
    }
  
    message += ' is on the way.';
  
    setSuccessMessage(message);
    reset(); // Reset the form after successful submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <h2>Order Your Pizza</h2>
    {isSubmitSuccessful && <div className='success'>{successMessage}</div>}
    {errors.fullName && <div className='error'>{errors.fullName.message}</div>}
    {errors.size && <div className='error'>{errors.size.message}</div>}

    <div className="input-group">
      <div>
        <label htmlFor="fullName">Full Name</label><br />
        <input placeholder="Type full name" id="fullName" type="text" {...register('fullName')} />
      </div>
    </div>

    <div className="input-group">
      <div>
        <label htmlFor="size">Size</label><br />
        <select id="size" {...register('size')}>
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
      </div>
    </div>

    <div className="input-group">
      {toppings.map((topping) => (
        <label key={topping.topping_id}>
          <input
            type="checkbox"
            {...register(`toppings.${topping.text}`)}
          />
          {topping.text}<br />
        </label>
      ))}
    </div>

    <input type="submit" disabled={Object.keys(errors).length > 0} />
  </form>
  );
}
