import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

//import {Icon}  from 'native-base';
import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, Button, primary } from '../../common/components/native';
import { placeholderColor } from '../../common/components/native/styles';
import { required, validateForm } from '../../../../../common/validation';

const studentFormSchema = {
  firstName: [required],
  lastName: [required],
  birthDate:[required],
  content: [required]
};

const validate = values => validateForm(values, studentFormSchema);

const StudentForm = ({ values, handleSubmit, t }) => {
  return (
    <FormView style={{ paddingHorizontal: 15 }}>
      <Field
        name="firstName"
        component={RenderField}
        type="text"
        //placeholder={t('student.field.firstName')}
        placeholder="First Name"
        value={values.firstName}
        placeholderTextColor={placeholderColor}
      />

      <Field
        name="lastName"
        component={RenderField}
        type="text"
        //placeholder={t('student.field.lastName')}
        placeholder="Last Name"
        value={values.lastName}
        placeholderTextColor={placeholderColor}
      />
	  
	    <Field
        name="birthDate"
        component={RenderField}
        type="text"
        //placeholder={t('student.field.birthDate')}
        placeholder="Birth Date"
        value={values.birthDate}
        placeholderTextColor={placeholderColor}
      />

      <Field
        name="content"
        component={RenderField}
        type="text"
        placeholder={t('student.field.content')}
        value={values.content}
        placeholderTextColor={placeholderColor}
      />
      <Button onPress={handleSubmit}>{t('student.btn.submit')}</Button>
    </FormView>
  );
};

StudentForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  values: PropTypes.object,
  t: PropTypes.func
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
