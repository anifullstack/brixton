import React from 'react';
import PropTypes from 'prop-types';
import { Form as RSForm } from 'reactstrap';
import { Card } from '../components';

const Form = ({ children, layout, ...props }) => {
  let inline = false;
  if (layout === 'inline') {
    inline = true;
  }
  return (
    <Card className="cardform">
      <RSForm {...props} inline={inline}>
        {children}
      </RSForm>
    </Card>
  );
};

Form.propTypes = {
  children: PropTypes.node,
  layout: PropTypes.string,
  type: PropTypes.string
};

export default Form;
