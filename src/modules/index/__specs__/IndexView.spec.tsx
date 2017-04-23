import * as React from 'react';
import { shallow } from 'enzyme';
import IndexView from '../IndexView';
import Todo from '../../../common/Todo';

describe('IndexView', () => {
    const testTodo1 = new Todo(0, 'title');
    const testTodo2 = new Todo(1, 'testing', true);
    const testTitle = 'A title';
    const testSetTitle = jest.fn();
    const testSaveTodo = jest.fn();
    const testSetDone = jest.fn();
    const wrapperMinimalProps = shallow((
        <IndexView
            title=""
            todos={[]}
            loading={false}
            setTitle={testSetTitle}
            saveTodo={testSaveTodo}
            setDone={testSetDone}
        />
    ));
    const wrapperMaximumProps = shallow((
        <IndexView
            title={testTitle}
            todos={[testTodo1, testTodo2]}
            loading={true}
            setTitle={testSetTitle}
            saveTodo={testSaveTodo}
            setDone={testSetDone}
        />
    ));

    it('should render with correct props', () => {
        expect(wrapperMinimalProps).toMatchSnapshot();
        expect(wrapperMaximumProps).toMatchSnapshot();
    });

    it('should call the correct functions when typing to input field', () => {
        const testValue = 'A_TEST_VALUE';
        wrapperMinimalProps.find('[type="text"]').simulate('change', { target: { value: testValue }});
        expect(testSetTitle).toBeCalledWith(testValue);
    });
});
