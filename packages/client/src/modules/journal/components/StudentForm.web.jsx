import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const studentFormSchema = {
  firstName: [required],
  lastName: [required],
  birthDate: [required],
  content: [required]
};

const validate = values => validateForm(values, studentFormSchema);

const StudentForm = ({ values, handleSubmit, submitting, t }) => {
  return (
    <Form name="student" onSubmit={handleSubmit}>
      <Field
        name="firstName"
        component={RenderField}
        type="text"
        label={t('student.field.firstName')}
        value={values.firstName}
      />

      <Field
        name="lastName"
        component={RenderField}
        type="text"
        label={t('student.field.lastName')}
        value={values.lastName}
      />

      <Field
        name="birthDate"
        component={RenderField}
        type="text"
        label={t('student.field.birthDate')}
        value={values.birthDate}
      />

      <Field
        name="content"
        component={RenderField}
        type="text"
        label={t('student.field.content')}
        value={values.content}
      />
      <Button color="primary" type="submit" disabled={submitting}>
        {t('student.btn.submit')}
      </Button>
    </Form>
  );
};

StudentForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  student: PropTypes.object,
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
  enableReinitialize: true,
  displayName: 'StudentForm' // helps with React DevTools
});

export default translate('student')(StudentFormWithFormik(StudentForm));
