
import React, { useState, useEffect } from 'react';

import { Form, Button, Alert } from 'react-bootstrap';


import { useMutation } from '@apollo/client';
import { LOGIN_USER } from "../utils/mutations";

import Auth from '../utils/auth';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // : setup mutation for login
  const [login, {error}] = useMutation(LOGIN_USER);

  // : use effect for error
  useEffect (() => {
    if (error) {
      setShowAlert(true)
    }
    else {
      setShowAlert(false);
    }
  }, [error])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // : REST API
      // const response = await loginUser(userFormData);
      // :
      const { data } = await login({
        variables: { ...userFormData }
      })

      // : REST API
      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }

      // : REST API
      // const { token, user } = await response.json();

      // : REST API
      // console.log(user);
      // Auth.login(token);

      //:
      console.log("handleFormSubmit: data: ", data);
      Auth.login(data.login.token);

    } catch (err) {
      console.error(err);
      // : REST API. We use useEffect for error. See comment above
      // setShowAlert(true);
    }

    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
