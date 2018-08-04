import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import {Button, FormView, RenderField } from '../../common/components/native';
import { placeholderColor} from '../../common/components/native/styles';
import { required, validateForm } from '../../../../../common/validation';

const studentFormSchema = {
  firstName: [required],
  lastName: [required],
  birthDate: [required],
  content: [required]
};

const validate = values => validateForm(values, studentFormSchema);

const StudentForm = ({ values, handleSubmit }) => {
  return (
    <FormView style={{padding:10}}>
      <Field name="firstName" component={RenderField} type="text" placeholder="First Name"  placeholderTextColor={placeholderColor} value={values.firstName} />
      <Field name="lastName" component={RenderField} type="text" placeholder="Last Name"  placeholderTextColor={placeholderColor} value={values.lastName} />
      <Field name="birthDate" component={RenderField} type="text" placeholder="Birth Date"  placeholderTextColor={placeholderColor} value={values.birthDate} />
      <Field name="content" component={RenderField} type="text" placeholder="content"  placeholderTextColor={placeholderColor} value={values.content} />
      <Button onPress={handleSubmit}>Save</Button>
    </FormView>
  );
};

StudentForm.propTypes = {
  handleSubmit: PropTypes.func,
  setFieldTouched: PropTypes.func,
  setFieldValue: PropTypes.func,
  valid: PropTypes.bool,
  values: PropTypes.object
};

const StudentFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    firstName: props.student && props.student.firstName,
    lastName: props.student && props.student.lastName,
    birthDate: props.student && props.student.birthDate,
    content: props.student && props.student.content
  }),
  validate: values => validate(values),
  handleSubmit(
    values,
    {
      props: { onSubmit }
    }
  ) {
    onSubmit(values);
  },
  displayName: 'StudentForm' // helps with React DevTools
});

export default translate('student')(StudentFormWithFormik(StudentForm));
