import React, {useState} from 'react';
import fetch from 'cross-fetch';
import './App.css';

import { Form, Button, Radio, Select, InputNumber, Spin } from 'antd';
import FormBuilder from 'antd-form-builder';

const FormComponent = () => {
  const [personValues, setPersonValues] = useState({
    age: 0,
    bmi: '--',
    children: 0,
    sex: '',
    smoker: '',
    region: ''
  });
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [result, setResult] = useState('--');
  const [units, setUnits] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();
  const forceUpdate = FormBuilder.useForceUpdate();

  const checkAge = (rule, value, callback) => {
    if (value < 18) {
      callback('Age must be above 17');
    }
    else {
      callback();
    }
  };

  const meta = {
    fields: [
      {key: 'region',
        name: 'region',
        label: 'Region',
        widget: Select, options: ['northwest', 'northeast','southwest','southeast'],
        required: true,
        message: 'Region is required',
        widgetProps: {style: {width: 110},
          onChange: e => {e.preventDefault; setPersonValues({...personValues, region: e});}}
      },
      { key: 'age',
        name: 'age',
        label: 'Age',
        widget: InputNumber,
        required: true,
        message: 'Age is required',
        rules: [{validator: checkAge}],
        widgetProps: {onChange: e => {setPersonValues({...personValues, age: e});}}
      },
      { key: 'children',
        name: 'children',
        label: 'Children',
        widget: InputNumber,
        initialValue: 0,
        required: true,
        message: 'Children is required. If no children please type 0',
        widgetProps: {min: 0,
          onChange: e => {setPersonValues({...personValues, children: e});}}
      },
      {key: 'smoker',
        name: 'smoker',
        label: 'Smoker',
        widget: Radio.Group,
        options: [{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}],
        required:true,
        message: 'Smoker is a required field',
        widgetProps: {onChange: e => setPersonValues({...personValues, smoker: e.target.value})}
      },
      {key: 'gender',
        name: 'sex',
        label: 'Gender',
        widget: Radio.Group,
        options: [{value: 'female', label: 'Female'}, {value: 'male', label: 'Male'}],
        required: true,
        message: 'Gender is required',
        widgetProps: {style: {width: 200},
          onChange: e => setPersonValues({...personValues, sex: e.target.value})}
      },
      {key: 'units',
        name: 'units',
        label: 'Units',
        initialValue: 1,
        widget: Radio.Group, options: [{value: 1, label:'Kg/cm'}, {value: 2, label: 'Lbs/ft'}],
        message: 'Select units to calculate your BMI',
        widgetProps: {onChange: (e) => setUnits(e.target.value)}
      },
      {key: 'weight',
        name:'weight',
        label: 'Weight',
        required:true,
        message: 'Please enter your weight',
        widget: InputNumber,
        widgetProps: {min: 1, onChange: e => setWeight(e)}
      },
      {key: 'height',
        name: 'height',
        label: 'Height',
        required:true,
        message: 'Please enter your height',
        widget: InputNumber,
        widgetProps: { min: 1, onChange: e => setHeight(e)}
      }
    ],
  };

  const handleCalcBmi = (e) => {
    e.preventDefault();
    if ((weight && height) && units === 1) {
      let bmiResult = weight / Math.pow((height / 100), 2);
      setPersonValues({...personValues, bmi: bmiResult.toFixed(2)});
    } else {
      let bmiResult = weight / Math.pow((height * 12), 2) * 703;
      setPersonValues({...personValues, bmi: bmiResult.toFixed(2)});
    }
  };

  const onFinish = () => {
    setIsLoading(true);
    fetch('http://127.0.0.1:5000/predict_insurance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personValues),
    })
      .then((res) => res.json())
      .then((result) =>{
        setResult(result['estimated_expenses']);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form form={form} onValuesChange={forceUpdate} onFinish={onFinish} onFinishFailed={onFinishFailed} className='form'>
      <section className='form-container'>
        <FormBuilder meta={meta} form={form} />
        <Form.Item>
          <h2>{personValues.bmi}</h2>
        </Form.Item>
        <Form.Item >
          <Button className='bmi-btn' onClick={handleCalcBmi}>Calculate BMI</Button>
        </Form.Item>
        <Form.Item >
          {personValues.bmi !== '--' ?
            (<Button className='submit-btn'
              htmlType="submit"
            >Estimated Insurance
            </Button>)
            :
            (<Button
              className='submit-btn'
              htmlType="submit"
              disabled >
              Estimated Insurance
            </Button>)}
        </Form.Item>
        <Form.Item >
          {isLoading ? <Spin/> : <h1>$ {result}</h1>}
        </Form.Item>
      </section>
    </Form>
  );
};

export default FormComponent;
