import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { FormView, RenderField, Button, primary } from '../../common/components/native';
import { placeholderColor } from '../../common/components/native/styles';
import { required, validateForm } from '../../../../../common/validation';

const journalFormSchema = {
  content: [required]
};

const validate = values => validateForm(values, journalFormSchema);

const StudentJournalForm = ({ values, handleSubmit, journal, t }) => {
  const operation = t(`journal.label.${journal.id ? 'edit' : 'add'}`);

  return (
    <FormView style={{ paddingHorizontal: 15 }}>
      <Field
        name="content"
        component={RenderField}
        type="text"
        value={values.content}
        placeholder={t('journal.label.field')}
        placeholderTextColor={placeholderColor}
      />
      <Button type={primary} onPress={handleSubmit}>
        {operation}
      </Button>
    </FormView>
  );
};

StudentJournalForm.propTypes = {
  handleSubmit: PropTypes.func,
  journal: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  t: PropTypes.func
};

const StudentJournalFormWithFormik = withFormik({
  mapPropsToValues: props => ({ content: props.journal && props.journal.content }),
  validate: values => validate(values),
  handleSubmit: async (values, { resetForm, props: { onSubmit } }) => {
    await onSubmit(values);
    resetForm({ content: '' });
  },
  displayName: 'JournalForm', // helps with React DevTools
  enableReinitialize: true
});

export default translate('student')(StudentJournalFormWithFormik(StudentJournalForm));
