import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button, Pagination } from '../../common/components/web';
import translate from '../../../i18n';
import settings from '../../../../../../settings';
import paginationConfig from '../../../../../../config/pagination';

const { itemsNumber, type } = paginationConfig.web;

class StudentList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    students: PropTypes.object,
    deleteStudent: PropTypes.func.isRequired,
    loadData: PropTypes.func,
    t: PropTypes.func
  };

  handleDeleteStudent = id => {
    const { deleteStudent } = this.props;
    deleteStudent(id);
  };

  renderMetaData = () => {
    const { t } = this.props;
    return (
      <Helmet
        title={`${settings.app.name} - ${t('list.title')}`}
        meta={[
          {
            name: 'description',
            content: `${settings.app.name} - ${t('list.meta')}`
          }
        ]}
      />
    );
  };

  handlePageChange = (pagination, pageNumber) => {
    const {
      students: {
        pageInfo: { endCursor }
      },
      loadData
    } = this.props;
    if (pagination === 'relay') {
      loadData(endCursor + 1, 'add');
    } else {
      loadData((pageNumber - 1) * itemsNumber, 'replace');
    }
  };

  render() {
    const { loading, students, t } = this.props;
    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">{t('student.loadMsg')}</div>
        </PageLayout>
      );
    } else {
      const columns = [
        {
          title: t('list.column.FirstName'),
          dataIndex: 'firstName',
          key: 'firstName',
          render: (text, record) => (
            <Link className="student-link" to={`/student/${record.id}`}>
              {text}
            </Link>
          )
        },
		
		{
           title: t('list.column.LastName'),
          dataIndex: 'lastName',
          key: 'lastName',
          render: (text, record) => (
            <Link className="student-link" to={`/student/${record.id}`}>
              {text}
            </Link>
          )
        },
		
		{
          title: t('list.column.birthDate'),
          dataIndex: 'birthDate',
          key: 'birthDate',
          render: (text, record) => (
            <Link className="student-link" to={`/student/${record.id}`}>
              {text}
            </Link>
          )
        },
		
        {
          title: t('list.column.actions'),
          key: 'actions',
          width: 50,
          render: (text, record) => (
		   <div>
              <Link className="student-link" to={`/student/${record.id}`}>
                <Button
				//color="primary" size="sm" className="delete-button"
				>
                  Edit 
                </Button>
              </Link>
			  
            <Button
              //color="primary"
              //size="sm"
              //className="delete-button"
              onClick={() => this.handleDeleteStudent(record.id)}
            >
              {t('student.btn.del')}
            </Button>
			</div>
          )
        }
      ];
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>{t('list.subTitle')}</h2>
          <Link to="/student/new">
            <Button color="primary">{t('list.btn.add')}</Button>
          </Link>
          <h1 />
          <Table dataSource={students.edges.map(({ node }) => node)} columns={columns} />
          <Pagination
            itemsPerPage={students.edges.length}
            handlePageChange={this.handlePageChange}
            hasNextPage={students.pageInfo.hasNextPage}
            pagination={type}
            total={students.totalCount}
            loadMoreText={t('list.btn.more')}
            defaultPageSize={itemsNumber}
          />
        </PageLayout>
      );
    }
  }
}

export default translate('student')(StudentList);
