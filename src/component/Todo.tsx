/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Type';

type Props = {
  todo: Todo | null;
  handleDelete: (id: number) => void;
  isProcessing: boolean;
  updateCompleted?: (id: number, completed: boolean) => void;
  updateTitle?: (id: number, newTitle: string) => void;
  todos?: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  isProcessing,
  updateCompleted,
  updateTitle,
  todos,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo ? todo.title : '');

  if (!todo) {
    return null;
  }

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleSubmit = () => {
    const isUnic = todos?.every(
      todoItem => todoItem.title !== editedTitle.trim(),
    );

    if (editedTitle.trim() && updateTitle && isUnic) {
      updateTitle(todo.id, editedTitle.trim());
    }

    if (!isUnic) {
      setEditedTitle(todo.title);
    }

    if (!editedTitle.trim()) {
      handleDelete(todo.id);
    }

    setIsEditing(false);
  };

  const handleBlur = () => {
    handleTitleSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTitleSubmit();
    } else if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            updateCompleted && updateCompleted(todo.id, todo.completed)
          }
        />
      </label>
      {isEditing ? (
        <input
          className="todo__edit"
          value={editedTitle}
          data-cy="TodoTitleField"
          onChange={handleTitleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
