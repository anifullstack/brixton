import React from 'react';
import PropTypes from 'prop-types';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import StudentJournalForm from './StudentJournalForm';

class StudentJournalsView extends React.PureComponent {
  static propTypes = {
    studentId: PropTypes.number.isRequired,
    journals: PropTypes.array.isRequired,
    journal: PropTypes.object,
    addJournal: PropTypes.func.isRequired,
    editJournal: PropTypes.func.isRequired,
    deleteJournal: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    onJournalSelect: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleEditJournal = (id,subject, activity, activityDate, content) => {
    const { onJournalSelect } = this.props;
    onJournalSelect({ id, subject, activity, activityDate, content });
  };

  handleDeleteJournal = id => {
    const { journal, onJournalSelect, deleteJournal } = this.props;

    if (journal.id === id) {
      onJournalSelect({
		id: null,
		subject: '',
        activity: '',
        activityDate: '',
        content: ''
		  });
    }

    deleteJournal(id);
  };

  onSubmit = () => values => {
    const { journal, studentId, addJournal, editJournal, onJournalSelect } = this.props;

    if (journal.id === null) {
      addJournal(values.subject, values.activity, values.activityDate,values.content, studentId);
    } else {
      editJournal(journal.id, values.subject, values.activity, values.activityDate,values.content);
    }

    onJournalSelect({
	  id: null,
	  subject: '',
      activity: '',
      activityDate: '', 
	  content: '' 
	  });
  };

  render() {
    const { studentId, journals, journal,subjects, activitys, t } = this.props;
    const columns = [
	   {
        title: 'Activity Date',
        dataIndex: 'activityDate',
        key: 'activityDate'
      },
      {
        title: 'subject',
        dataIndex: 'subject',
        key: 'subject'
      },
      {
        title: 'activity',
        dataIndex: 'activity',
        key: 'activity'
      },
      {
        title: t('journal.column.content'),
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: t('journal.column.actions'),
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              //color="primary"
              size="sm"
              //className="edit-journal"
              onClick={() => this.handleEditJournal(record.id, record.content)}
            >
              {t('journal.btn.edit')}
            </Button>{' '}
            <Button
              //color="primary"
              size="sm"
             // className="delete-journal"
              onClick={() => this.handleDeleteJournal(record.id)}
            >
              {t('journal.btn.del')}
            </Button>
          </div>
        )
      }
    ];
    console.log('StudentJournalsView||render||props.student.id' + this.props.studentId);
    return (
      <div>
        <h3>{t('journal.title')}</h3>
        <StudentJournalForm
          studentId={studentId}
          onSubmit={this.onSubmit()}
          initialValues={journal}
          journal={journal}
		   subjects={subjects}
          activitys={activitys}
        />
        <h1 />
        <Table dataSource={journals} columns={columns} />
      </div>
    );
  }
}

export default translate('student')(StudentJournalsView);
