import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'redux-react-hook';
import todoActions from '../../data/todo/actions';
import styles from './styles.css';
const Home = ({ todos, gitData, addTodo, state, loadGitInfo })=>{
  console.log(state);
  const [todoValue, setTodoValue] = useState('');
  const dispatch = useDispatch();
  return (
    <div>
      <h3>Home page</h3>
      <p className={ styles.dataWrap }>
        {
          JSON.stringify(gitData)
        }
      </p>

      <input onChange={ (e) => {
        setTodoValue(e.target.value);
      } }/>
      <button className={ styles.addButton } onClick={ () => {
        if (!todoValue.trim()) {
          return;
        }
        addTodo(todoValue);
      } }>
        Add Todo
      </button>

      <button className={ styles.addButton } onClick={ () => {
        //loadGitInfo();
        dispatch(todoActions.getGitInfo());
      } }>
        Get Git Info
      </button>

      <div>{
        todos.map((todo, index) => (
          <p key={ index + 'k' }>{ todo.text }</p>
        ))
      }</div>
    </div>
  )
}

const mapStateToProps = state => ({
  todos: state.todo.todos,
  gitData: state.todo.gitData,
  state: state,
});

const mapDispatchToProps = dispatch => ({
  addTodo: value => dispatch(todoActions.addTodo(value)),
  loadGitInfo: () => dispatch(todoActions.loadGitInfo()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);