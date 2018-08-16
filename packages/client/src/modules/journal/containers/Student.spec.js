import chai, { expect } from 'chai';
import { step } from 'mocha-steps';
import _ from 'lodash';

import Renderer from '../../../testHelpers/Renderer';
import { wait, find, findAll, updateContent, click, change, submit } from '../../../testHelpers/testUtils';
import STUDENTS_SUBSCRIPTION from '../graphql/StudentsSubscription.graphql';
import STUDENT_SUBSCRIPTION from '../graphql/StudentSubscription.graphql';
import JOURNAL_SUBSCRIPTION from '../graphql/JournalSubscription.graphql';

chai.should();

const createNode = id => ({
  id: `${id}`,
  title: `Student title ${id}`,
  content: `Student content ${id}`,
  journals: [
    { id: id * 1000 + 1, content: 'Student journal 1', __typename: 'Journal' },
    { id: id * 1000 + 2, content: 'Student journal 2', __typename: 'Journal' }
  ],
  __typename: 'Student'
});

const mutations = {
  editStudent: true,
  addJournal: true,
  editJournal: true,
  onJournalSelect: true
};

const mocks = {
  Query: () => ({
    students(ignored, { after }) {
      const totalCount = 4;
      const edges = [];
      const studentId = after < 1 ? +after + 1 : +after;
      for (let i = studentId; i <= studentId + 1; i++) {
        edges.push({
          cursor: i,
          node: createNode(i),
          __typename: 'StudentEdges'
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true,
          __typename: 'StudentPageInfo'
        },
        __typename: 'Students'
      };
    },
    student(obj, { id }) {
      return createNode(id);
    }
  }),
  Mutation: () => ({
    deleteStudent: (obj, { id }) => createNode(id),
    deleteJournal: (obj, { input }) => input,
    ...mutations
  })
};

describe('Students and journals example UI works', () => {
  const renderer = new Renderer(mocks, {});
  let app;
  let container;
  let content;

  beforeEach(() => {
    // Reset spy mutations on each step
    Object.keys(mutations).forEach(key => delete mutations[key]);
    if (app) {
      container = app.container;
      content = updateContent(container);
    }
  });

  step('Students page renders without data', () => {
    app = renderer.mount();
    container = app.container;
    renderer.history.push('/students');
    content = updateContent(container);
    content.textContent.should.equal('Loading...');
  });

  step('Students page renders with data', () => {
    expect(content.textContent).to.include('Student title 1');
    expect(content.textContent).to.include('Student title 2');
    expect(content.textContent).to.include('2 / 4');
  });

  step('Clicking load more works', () => {
    const loadMoreButton = find(container, '#load-more');
    click(loadMoreButton);
  });

  step('Clicking load more loads more students', () => {
    expect(content.textContent).to.include('Student title 3');
    expect(content.textContent).to.include('Student title 4');
    expect(content.textContent).to.include('4 / 4');
  });

  step('Check subscribed to student list updates', () => {
    expect(renderer.getSubscriptions(STUDENTS_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates student list on student delete from subscription', () => {
    const subscription = renderer.getSubscriptions(STUDENTS_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        studentsUpdated: {
          mutation: 'DELETED',
          node: createNode(2),
          __typename: 'UpdateStudentPayload'
        }
      }
    });

    expect(content.textContent).to.not.include('Student title 2');
    expect(content.textContent).to.include('3 / 3');
  });

  step('Updates student list on student create from subscription', () => {
    const subscription = renderer.getSubscriptions(STUDENTS_SUBSCRIPTION)[0];
    subscription.next(
      _.cloneDeep({
        data: {
          studentsUpdated: {
            mutation: 'CREATED',
            node: createNode(2),
            __typename: 'UpdateStudentPayload'
          }
        }
      })
    );

    expect(content.textContent).to.include('Student title 2');
    expect(content.textContent).to.include('4 / 4');
  });

  step('Clicking delete optimistically removes student', () => {
    mutations.deleteStudent = (obj, { id }) => {
      return createNode(id);
    };

    const deleteButtons = findAll(container, '.delete-button');
    expect(deleteButtons).has.lengthOf(4);
    click(deleteButtons[deleteButtons.length - 1]);
    expect(content.textContent).to.not.include('Student title 4');
    expect(content.textContent).to.include('3 / 3');
  });

  step('Clicking delete removes the student', () => {
    expect(content.textContent).to.include('Student title 3');
    expect(content.textContent).to.not.include('Student title 4');
    expect(content.textContent).to.include('3 / 3');
  });

  step('Clicking on student works', () => {
    const studentLinks = findAll(container, '.student-link');
    click(studentLinks[studentLinks.length - 1]);
  });

  step('Clicking on student opens student form', () => {
    expect(content.textContent).to.include('Edit Student');
    const studentForm = find(container, 'form[name="student"]');
    expect(find(studentForm, '[name="title"]').value).to.equal('Student title 3');
    expect(find(studentForm, '[name="content"]').value).to.equal('Student content 3');
  });

  step('Check subscribed to student updates', () => {
    expect(renderer.getSubscriptions(STUDENT_SUBSCRIPTION)).has.lengthOf(1);
  });

  step('Updates student form on student updated from subscription', () => {
    const subscription = renderer.getSubscriptions(STUDENT_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        studentUpdated: {
          mutation: 'UPDATED',
          id: '3',
          node: {
            id: '3',
            title: 'Student title 203',
            content: 'Student content 204',
            __typename: 'Student'
          },
          __typename: 'UpdateStudentPayload'
        }
      }
    });
    const studentForm = find(container, 'form[name="student"]');
    expect(find(studentForm, '[name="title"]').value).to.equal('Student title 203');
    expect(find(studentForm, '[name="content"]').value).to.equal('Student content 204');
  });

  step('Student editing form works', done => {
    mutations.editStudent = (obj, { input }) => {
      expect(input.id).to.equal(3);
      expect(input.title).to.equal('Student title 33');
      expect(input.content).to.equal('Student content 33');
      done();
      return input;
    };

    const studentForm = find(container, 'form[name="student"]');
    change(find(studentForm, '[name="title"]'), { target: { name: 'title', value: 'Student title 33' } });
    change(find(studentForm, '[name="content"]'), { target: { name: 'content', value: 'Student content 33' } });
    submit(studentForm);
  });

  step('Check opening student by URL', () => {
    renderer.history.push('/student/3');
  });

  step('Opening student by URL works', () => {
    const studentForm = find(container, 'form[name="student"]');
    expect(content.textContent).to.include('Edit Student');
    expect(find(studentForm, '[name="title"]').value).to.equal('Student title 33');
    expect(find(studentForm, '[name="content"]').value).to.equal('Student content 33');
  });

  step('Journal adding works', done => {
    mutations.addJournal = (obj, { input }) => {
      expect(input.studentId).to.equal(3);
      expect(input.content).to.equal('Student journal 24');
      done();
      return input;
    };

    const journalForm = find(container, 'form[name="journal"]');
    change(find(journalForm, '[name="content"]'), { target: { name: 'content', value: 'Student journal 24' } });
    submit(journalForm);
  });

  step('Journal adding works after submit', () => {
    expect(content.textContent).to.include('Student journal 24');
  });

  step('Updates journal form on journal added got from subscription', () => {
    const subscription = renderer.getSubscriptions(JOURNAL_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        journalUpdated: {
          mutation: 'CREATED',
          id: 3003,
          studentId: 3,
          node: {
            id: 3003,
            content: 'Student journal 3',
            __typename: 'Journal'
          },
          __typename: 'UpdateJournalPayload'
        }
      }
    });

    expect(content.textContent).to.include('Student journal 3');
  });

  step('Updates journal form on journal deleted got from subscription', () => {
    const subscription = renderer.getSubscriptions(JOURNAL_SUBSCRIPTION)[0];
    subscription.next({
      data: {
        journalUpdated: {
          mutation: 'DELETED',
          id: 3003,
          studentId: 3,
          node: {
            id: 3003,
            content: 'Student journal 3',
            __typename: 'Journal'
          },
          __typename: 'UpdateJournalPayload'
        }
      }
    });
    expect(content.textContent).to.not.include('Student journal 3');
  });

  step('Journal deleting optimistically removes journal', () => {
    const deleteButtons = findAll(container, '.delete-journal');
    expect(deleteButtons).has.lengthOf(3);
    click(deleteButtons[deleteButtons.length - 1]);
    expect(content.textContent).to.not.include('Student journal 24');
    expect(findAll(container, '.delete-journal')).has.lengthOf(2);
  });

  step('Clicking journal delete removes the journal', () => {
    expect(content.textContent).to.not.include('Student journal 24');
    expect(findAll(container, '.delete-journal')).has.lengthOf(2);
  });
  step('Journal editing works', async done => {
    mutations.editJournal = (obj, { input }) => {
      expect(input.studentId).to.equal(3);
      expect(input.content).to.equal('Edited journal 2');
      done();
      return input;
    };
    const editButtons = findAll(container, '.edit-journal');
    expect(editButtons).has.lengthOf(2);
    click(editButtons[editButtons.length - 1]);
    await wait(() => app.getByPlaceholderText('Journal', { exact: false }));
    const journalForm = find(container, 'form[name="journal"]');
    expect(find(journalForm, '[name="content"]').value).to.equal('Student journal 2');
    change(find(journalForm, '[name="content"]'), { target: { name: 'content', value: 'Edited journal 2' } });
    submit(journalForm);
  });

  step('Clicking back button takes to student list', async () => {
    expect(content.textContent).to.include('Edited journal 2');
    const backButton = find(container, '#back-button');
    click(backButton);
    content = updateContent(container);
    // change students query fetching policy, now if present difference in data we will get data from network
    expect(content.textContent).to.include('Student title 1');
  });
});
